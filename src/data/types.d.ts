declare module 'ascendancies.json' {
  import('../types').Ascendancy;
}

declare module './generated/gems.json' {
  // const value: Record<string, import('../types').Gem>;
  const value: boolean;
  export default value;
}
