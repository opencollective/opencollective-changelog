import yearlogs from "../../changelogs/2019";

export default (req, res) => {
  res.status(200).json(yearlogs);
};
