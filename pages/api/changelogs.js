import yearlogs2019 from "../../changelogs/2019";
import yearlogs2020 from "../../changelogs/2020";

export default (req, res) => {
  res.status(200).json({
    "year-2020": yearlogs2020,
    "year-2019": yearlogs2019
  });
};
