export function calc_percentage_for_fee(
  fee_size: number,
  total_cost_size: number
) {
  //    fee: (trade.market_fee / (trade.asset_change * trade.price)) * 100
  return (fee_size / total_cost_size) * 100;
}
