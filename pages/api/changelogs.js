import yearlogs2019 from "../../changelogs/2019";
import yearlogs2020 from "../../changelogs/2020";
import yearlogs2021 from "../../changelogs/2021";
import yearlogs2022 from "../../changelogs/2022";
import yearlogs2023 from "../../changelogs/2023";

export default (req, res) => {
  res.status(200).json({
    "year-2023": yearlogs2023,
    "year-2022": yearlogs2022,
    "year-2021": yearlogs2021,
    "year-2020": yearlogs2020,
    "year-2019": yearlogs2019,
  });
};
