export function getDisplayCategory(product) {
  const backendCategory = String(
    product?.category || ""
  ).trim();

  const name = String(
    product?.name || ""
  ).trim().toLowerCase();

  const accessoryName =
    /\b(backpack|handbag|purse|wallet|crossbody bag|shoulder bag|tote bag|duffle bag)\b/i.test(
      name
    );

  if (accessoryName) {
    return "Accessories";
  }

  return backendCategory;
}
