import mongoose from 'mongoose';
import connectDB from '../src/lib/mongodb';
import Quote from '../src/models/Quote';

/**
 * Migration script to extract shipping addresses from message field
 * and move them to the new shippingAddress field
 */
async function migrateQuoteAddresses() {
  try {
    await connectDB();
    console.log('Connected to database');

    // Find all quotes that have a message but no shippingAddress
    const quotes = await Quote.find({
      message: { $exists: true, $ne: null },
    });

    console.log(`Found ${quotes.length} quotes to check`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const quote of quotes) {
      if (!quote.message) {
        skippedCount++;
        continue;
      }

      // Check if this is a legacy format message (contains "Contact:" or "Email:" or "Phone:")
      const isLegacyFormat = quote.message.includes('Contact:') || 
                            quote.message.includes('Email:') || 
                            quote.message.includes('Phone:');

      if (!isLegacyFormat) {
        skippedCount++;
        continue;
      }

      console.log(`\nProcessing quote ${quote._id}`);
      console.log('Original message:', quote.message);

      // Parse the message to extract shipping address
      const shippingAddressMatch = quote.message.match(/Shipping Address:\s*([^\n]+)/i);
      const additionalNotesMatch = quote.message.match(/Additional Notes:\s*(.+?)$/is);

      let shippingAddressString = shippingAddressMatch ? shippingAddressMatch[1].trim() : null;
      const actualMessage = additionalNotesMatch ? additionalNotesMatch[1].trim() : null;

      // If there's a shipping address, parse it into components
      let shippingAddress = null;
      if (shippingAddressString) {
        // Try to parse the address string into components
        // Format is typically: "Street, City, State, ZipCode"
        const addressParts = shippingAddressString.split(',').map(part => part.trim());
        
        if (addressParts.length >= 4) {
          // Full address with all components
          shippingAddress = {
            address: addressParts.slice(0, -3).join(', '), // Everything before last 3 parts
            city: addressParts[addressParts.length - 3],
            state: addressParts[addressParts.length - 2],
            zipCode: addressParts[addressParts.length - 1],
          };
        } else if (addressParts.length === 3) {
          // City, State, Zip
          shippingAddress = {
            city: addressParts[0],
            state: addressParts[1],
            zipCode: addressParts[2],
          };
        } else if (addressParts.length === 2) {
          // State, Zip
          shippingAddress = {
            state: addressParts[0],
            zipCode: addressParts[1],
          };
        } else {
          // Just store as address
          shippingAddress = {
            address: shippingAddressString,
          };
        }
      }

      // Update the quote
      const updateData: { message?: string | null; shippingAddress?: typeof shippingAddress } = {};
      
      // Only set message if there's an actual user message
      if (actualMessage) {
        updateData.message = actualMessage;
      } else {
        updateData.message = null; // Clear the legacy message
      }
      
      if (shippingAddress) {
        updateData.shippingAddress = shippingAddress;
      }

      await Quote.findByIdAndUpdate(quote._id, updateData);
      
      console.log('Updated with:');
      console.log('  Message:', updateData.message || '(cleared)');
      console.log('  Shipping Address:', JSON.stringify(updateData.shippingAddress, null, 2));
      
      updatedCount++;
    }

    console.log(`\n✅ Migration complete!`);
    console.log(`   Updated: ${updatedCount} quotes`);
    console.log(`   Skipped: ${skippedCount} quotes (already in correct format)`);

  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
}

// Run the migration
migrateQuoteAddresses();

