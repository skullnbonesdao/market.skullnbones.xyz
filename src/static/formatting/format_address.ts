export function format_address(address: string) {
  if (address)
    return (
      address.substring(0, 5) +
      "[...]" +
      address.substring(address.length, address.length - 5)
    );
}
