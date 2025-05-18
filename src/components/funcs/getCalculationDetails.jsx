export function getCalculationDetails(form) {
  if (form.adType === "digital") {
    const cpc = 20; // пример значения, можно брать из базы или настроек
    const clicks = Math.floor(form.budget / cpc);
    const reach = clicks * 10;
    return {
      steps: [
        `Бюджет: ${form.budget}₽`,
        `Средний CPC: ${cpc}₽`,
        `Клики = ${form.budget} / ${cpc} = ${clicks}`,
        `Охват = ${clicks} * 10 = ${reach}`,
      ],
      formula: "Клики = Бюджет / CPC",
      intermediate: { cpc, clicks, reach },
      explanation: `За ${form.budget}₽ вы получите примерно ${clicks} кликов и ${reach} охватов.`,
    };
  }

  if (form.adType === "billboard") {
    const ratePerSqMPerDay = 500; // пример ставки
    const cost = form.billboardDays * form.billboardSize * ratePerSqMPerDay;
    return {
      steps: [
        `Дней аренды: ${form.billboardDays}`,
        `Размер билборда: ${form.billboardSize} м²`,
        `Ставка: ${ratePerSqMPerDay}₽ за м² в день`,
        `Стоимость = ${form.billboardDays} × ${form.billboardSize} × ${ratePerSqMPerDay} = ${cost}₽`,
      ],
      formula: "Стоимость = Дней × Размер × Ставка",
      intermediate: { ratePerSqMPerDay, cost },
      explanation: `Итоговая стоимость аренды билборда: ${cost}₽.`,
    };
  }

  if (form.adType === "leaflet") {
    const materialCost = form.leafletMaterialCost || 0;
    const distributionCost = form.leafletDistributionCost || 0;
    const totalCost =
      ((materialCost + distributionCost) * form.leafletCount) / 1000;
    return {
      steps: [
        `Количество листовок: ${form.leafletCount}`,
        `Стоимость материала за 1000: ${materialCost}₽`,
        `Стоимость распространения за 1000: ${distributionCost}₽`,
        `Общая стоимость = (${materialCost} + ${distributionCost}) × ${form.leafletCount} / 1000 = ${totalCost}₽`,
      ],
      formula: "Стоимость = (Материал + Распространение) × Количество / 1000",
      intermediate: { materialCost, distributionCost, totalCost },
      explanation: `Итоговая стоимость распространения листовок: ${totalCost}₽.`,
    };
  }

  return {
    steps: [],
    formula: "",
    intermediate: {},
    explanation: "Детали расчёта отсутствуют.",
  };
}
