# Quote Address Migration Script

This script migrates existing quote records from the old format (where shipping address was concatenated in the message field) to the new format (separate shippingAddress field).

## What it does:

1. Finds all quotes with legacy format messages (containing "Contact:", "Email:", "Phone:")
2. Extracts the shipping address from the message field
3. Parses the address into structured components (address, city, state, zipCode)
4. Stores the address in the new `shippingAddress` field
5. Clears the message field (unless there's an actual user message in "Additional Notes")

## How to run:

```bash
node scripts/migrate-quote-addresses.mjs
```

Make sure your `.env.local` file has the `MONGODB_URI` variable set.

## Example transformation:

**Before:**
```
message: "Contact: John Doe\nEmail: john@example.com\nPhone: 1234567890\nShipping Address: 123 Main St, City, State, 12345"
shippingAddress: null
```

**After:**
```
message: null
shippingAddress: {
  address: "123 Main St",
  city: "City",
  state: "State",
  zipCode: "12345"
}
```

## Safety:

- The script only processes quotes with legacy format messages
- Modern quotes (created after the code update) are automatically skipped
- The script is idempotent - you can run it multiple times safely

