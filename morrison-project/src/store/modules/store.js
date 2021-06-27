const state = {
  words: [
    {word: "Leaves", type: "leaves", size: "large", top: 20, left: 48},
    {word: "Trunk", type: "trunk", size: "large", top: 54, left: 46},
    {word: "Roots", type: "roots", size: "large", top: 79, left: 45},
    {word: "Future", type: "leaves", size: "medium", top: 16, left: 32},
    {word: "Present", type: "trunk", size: "medium", top: 54, left: 62},
    {word: "Past", type: "roots", size: "medium", top: 86, left: 38},
    {word: "Milkman", type: "leaves", size: "medium", top: 23, left: 30},
    {word: "Gold", type: "leaves", size: "small", top: 27, left: 45},
    {word: "Pilate", type: "leaves", size: "small", top: 34, left: 35},
    {word: "Denver", type: "leaves", size: "medium", top: 24, left: 60},
    {word: "Paul D", type: "leaves", size: "small", top: 15, left: 51},
    {word: "Unknown", type: "leaves", size: "medium", top: 31, left: 54},
    {word: "Beloved", type: "trunk", size: "medium", top: 61, left: 47},
    {word: "Stamp Paid", type: "trunk", size: "small", top: 59, left: 59},
    {word: "Sethe", type: "trunk", size: "small", top: 48, left: 56},
    {word: "Guitar", type: "trunk", size: "medium", top: 52, left: 35},
    {word: "Hagar", type: "trunk", size: "small", top: 62, left: 32},
    {word: "Corinthians", type: "trunk", size: "small", top: 47, left: 43},
    {word: "Sing", type: "roots", size: "small", top: 82, left: 35},
    {word: "Solomon", type: "roots", size: "medium", top: 72, left: 32},
    {word: "Ryna", type: "roots", size: "small", top: 76, left: 28},
    {word: "Halle", type: "roots", size: "medium", top: 74, left: 60},
    {word: "Baby Suggs", type: "roots", size: "small", top: 86, left: 60},
    {word: "Schoolteacher", type: "roots", size: "small", top: 90, left: 45},
    {word: "Slavery", type: "roots", size: "medium", top: 75, left: 45}
  ],
  uneditableWords: ["Leaves", "Trunk", "Roots", "Future", "Present", "Past"],
  colors: {
    leaves: "#45801b",
    trunk: "#805b00",
    roots: "#80442d"
  },
  fontSizes: {
    small: "35px",
    medium: "50px",
    large: "65px"
  },
  inverted: false
};
const getters = {
  Words: state => state.words,
  UneditableWords: state => state.uneditableWords,
  Colors: state => state.colors,
  FontSizes: state => state.fontSizes,
  Inverted: state => state.inverted
};
const actions = {

};
const mutations = {
  setWords(state, words) {
    state.words = words;
  },
  resetWords(state) {
    state.words = [
      {word: "Leaves", type: "leaves", size: "large", top: 20, left: 48},
      {word: "Trunk", type: "trunk", size: "large", top: 54, left: 46},
      {word: "Roots", type: "roots", size: "large", top: 79, left: 45},
      {word: "Future", type: "leaves", size: "medium", top: 16, left: 32},
      {word: "Present", type: "trunk", size: "medium", top: 54, left: 62},
      {word: "Past", type: "roots", size: "medium", top: 86, left: 38},
      {word: "Milkman", type: "leaves", size: "medium", top: 23, left: 30},
      {word: "Gold", type: "leaves", size: "small", top: 27, left: 45},
      {word: "Pilate", type: "leaves", size: "small", top: 34, left: 35},
      {word: "Denver", type: "leaves", size: "medium", top: 24, left: 60},
      {word: "Paul D", type: "leaves", size: "small", top: 15, left: 51},
      {word: "Unknown", type: "leaves", size: "medium", top: 31, left: 54},
      {word: "Beloved", type: "trunk", size: "medium", top: 61, left: 47},
      {word: "Stamp Paid", type: "trunk", size: "small", top: 59, left: 59},
      {word: "Sethe", type: "trunk", size: "small", top: 48, left: 56},
      {word: "Guitar", type: "trunk", size: "medium", top: 52, left: 35},
      {word: "Hagar", type: "trunk", size: "small", top: 62, left: 32},
      {word: "Corinthians", type: "trunk", size: "small", top: 47, left: 43},
      {word: "Sing", type: "roots", size: "small", top: 82, left: 35},
      {word: "Solomon", type: "roots", size: "medium", top: 72, left: 32},
      {word: "Ryna", type: "roots", size: "small", top: 76, left: 28},
      {word: "Halle", type: "roots", size: "medium", top: 74, left: 60},
      {word: "Baby Suggs", type: "roots", size: "small", top: 86, left: 60},
      {word: "Schoolteacher", type: "roots", size: "small", top: 90, left: 45},
      {word: "Slavery", type: "roots", size: "medium", top: 75, left: 45}
    ];
  },
  setInverted(state, inverted) {
    state.inverted = inverted;
  }
};
export default {
  state,
  getters,
  actions,
  mutations
};
