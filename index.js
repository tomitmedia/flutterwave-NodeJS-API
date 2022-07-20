const express = require("express");

const app = express();
const port = 3000;

app.use(express.json());

app.post("/split-payments/compute", (req, res) => {
  const { ID, Amount, Currency, CustomerEmail, SplitInfo } = req.body;
  let comp = Amount;
  let flat;
  let percent;
  let ratio;

  for (let i = 0; i < SplitInfo.length; i++) {
    if (SplitInfo[i].SplitType === "FLAT") {
      flat = SplitInfo[i];

      comp = comp - flat.SplitValue;

      let Flat = {
        SplitEntityId: flat.SplitEntityId,
        Amount: flat.SplitValue,
      };

      SplitInfo[i] = Flat;
      console.log("flat = " + flat.SplitValue);
    } else if (SplitInfo[i].SplitType === "PERCENTAGE") {
      percent = SplitInfo[i];
      let cent;

      cent = (percent.SplitValue / 100) * comp;
      comp = comp - cent;

      let Percent = {
        SplitEntityId: percent.SplitEntityId,
        Amount: cent,
      };

      SplitInfo[i] = Percent;

      console.log("percent = " + cent);
    } else if (SplitInfo[i].SplitType === "RATIO") {
      ratio = SplitInfo[i];

      let total;
      total = ratio.SplitValue + 0;
      rat = (ratio.SplitValue / total) * comp;

      comp = comp - rat;

      let Ratio = {
        SplitEntityId: ratio.SplitEntityId,
        Amount: rat,
      };

      SplitInfo[i] = Ratio;
      console.log("ratio = " + rat);
    }
  }

  // console.log(SplitInfo)
  // console.log(comp)

  let result = {
    ID,
    Balance: comp,
    SplitBreakdown: SplitInfo,
  };

  res.send(result).status(200);
});

app.listen(port, () => {
  console.log("server on port" + port);
});
