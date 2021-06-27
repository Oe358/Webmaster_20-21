import axios from 'axios';

const state = {
  processing: false,
  confirmations: [],
  windowHeight: null,
  submittedProblems: null,
  problemMetaData: null,
  userSetup: {
    difficulty: null,
    topics: [],
    foci: [],
    calculus: null
  },
  userStats: {
    topics: [],
    presented: null,
    skipped: null,
    correct: null,
    avgAttempts: null,
    xp: null,
    streak: null
  },
  longestWinstreak: null,
  longestLosestreak: null,
  currProblem: {
    problemID: null,
    problemText: "",
    diagram: "",
    answer: "",
    solution: "",
    hintOne: "",
    hintTwo: null,
    difficulty: null,
    topic: "",
    topicName: "",
    mainFocus: "",
    mainFocusName: "",
    otherFoci: [],
  },
  currSubmission: {
    problemID: null,
    problemText: "",
    diagram: "",
    diagramFile: null,
    diagramType: "file",
    hintOne: "",
    hintTwo: "",
    hintTwoInclude: true,
    answer: "",
    mustMatch: false,
    solution: "",
    solutionDiagram: "",
    solutionDiagramFile: null,
    solutionDiagramType: "none",
    topic: "",
    mainFocus: "",
    otherFoci: [],
    source: "",
    category: "",
    author: "",
    sourceOther: "",
    problemNumber: "",
    difficulty: null,
    calculus: "None"
  },
  currSubmissionEdit: {
    problemID: null,
    problemText: "",
    diagram: "",
    diagramFile: null,
    diagramType: "file",
    hintOne: "",
    hintTwo: "",
    hintTwoInclude: true,
    answer: "",
    mustMatch: false,
    solution: "",
    solutionDiagram: "",
    solutionDiagramFile: null,
    solutionDiagramType: "none",
    topic: "",
    mainFocus: "",
    otherFoci: [],
    source: "",
    category: "",
    author: "",
    sourceOther: "",
    problemNumber: "",
    difficulty: null,
    calculus: "None"
  },
  pastAnswers: [],
  result: "",
  currAnswer: "<math xmlns=\"http://www.w3.org/1998/Math/MathML\"/>"
};
const getters = {
  Confirmations: state => state.confirmations,
  Processing: state => state.processing,
  WindowHeight: state => state.windowHeight,
  UserSetup: state => state.userSetup,
  SubmittedProblems: state => state.submittedProblems,
  UserStats: state => state.userStats,
  LongestWinstreak: state => state.longestWinstreak,
  LongestLosestreak: state => state.longestLosestreak,
  ProblemMetaData: state => state.problemMetaData,
  CurrSubmission: state => state.currSubmission,
  CurrSubmissionEdit: state => state.currSubmissionEdit,
  CurrProblem: state => state.currProblem,
  PastAnswers: state => state.pastAnswers,
  CurrAnswer: state => state.currAnswer,
  Result: state => state.result
};
const actions = {
  async Confirmation({commit}, message) {
    let id = Math.floor(Math.random() * 100000000);
    commit('addConfirmation', {
      id: id,
      message: message
    });
    setTimeout(function() {
      commit('removeConfirmation', id);
    }, 2000);
  },
  async GetUserInfo({commit, getters}) {
    let response = await axios.get('wp-json/physics_genie/user-info', {headers: {'Authorization': 'Bearer ' + getters.Token}});
    commit('setUserSetup', {
      difficulty: response.data.setup.curr_diff,
      topics: response.data.setup.curr_topics.split(""),
      foci: response.data.setup.curr_foci.split(""),
      calculus: response.data.setup.calculus === "1"
    });
    commit('setLongestStreaks', {
      winstreak: response.data.longest_winstreak,
      losestreak: response.data.longest_losestreak
    })
  },
  async GetProblemMetadata({commit, dispatch}) {
    let response = await axios.get('wp-json/physics_genie/submit-data');
    commit('setProblemMetaData', response.data);
    dispatch('GetUserStats');
    dispatch('GetSubmittedProblems');
  },
  async GetCurrProblem({commit, getters}) {
    let response = await axios.get('wp-json/physics_genie/problem', {headers: {'Authorization': 'Bearer ' + getters.Token}});
    let foci = [];
    if (response.data.other_foci !== null) {
      response.data.other_foci.split("").forEach(function(otherFocus) {
        foci.push(getters.ProblemMetaData.focuses.filter(function(focus) {return focus.focus === otherFocus})[0].name);
      });
    }
    commit('setCurrProblem', {
      problemID: response.data.problem_id,
      problemText: response.data.problem_text.replace(/\\\\/g, "\\").replace(/\\"/g, "'"),
      diagram: (response.data.diagram === null) ? null : response.data.diagram.replace(/\\\\/g, "\\").replace(/\\"/g, "'"),
      answer: response.data.answer.replace(/\\\\/g, "\\").replace(/\\"/g, "'"),
      solution: response.data.solution.replace(/\\\\/g, "\\").replace(/\\"/g, "'"),
      solutionDiagram: (response.data.solution_diagram === null) ? null : response.data.solution_diagram.replace(/\\\\/g, "\\").replace(/\\"/g, "'"),
      hintOne: response.data.hint_one.replace(/\\\\/g, "\\").replace(/\\"/g, "'"),
      hintTwo: (response.data.hint_two === null) ? null : response.data.hint_two.replace(/\\\\/g, "\\").replace(/\\"/g, "'"),
      difficulty: response.data.difficulty,
      topic: response.data.topic,
      topicName: getters.ProblemMetaData.topics.filter(function(topic) {return topic.topic === response.data.topic})[0].name,
      mainFocus: response.data.main_focus,
      mainFocusName: getters.ProblemMetaData.focuses.filter(function(focus) {return focus.focus === response.data.main_focus})[0].name,
      otherFoci: foci,
    });
  },
  async GetUserStats({commit, getters}) {
    let response = await axios.get('wp-json/physics_genie/user-stats', {headers: {'Authorization': 'Bearer ' + getters.Token}});
    let stats = {
      topics: [],
      presented: 0,
      skipped: 0,
      correct: 0,
      avgAttempts: 0,
      xp: 0,
      streak: 0
    };
    response.data.forEach(row => {

      if (getters.ProblemMetaData.focuses.filter(function(focus) {return focus.focus === row.focus}).length > 0) {
        stats.presented += parseInt(row.num_presented);
        stats.skipped += parseInt(row.num_skipped);
        stats.correct += parseInt(row.num_correct);
        stats.avgAttempts = (stats.avgAttempts * stats.presented + row.avg_attempts * row.num_presented) / (stats.presented + row.num_presented);
        stats.xp += parseInt(row.xp);

        let index = 0;
        if (stats.topics.filter(function(topic) {return topic.topicId === row.topic}).length > 0) {
          for (let i = 0; i < stats.topics.length; i++) {
            if (stats.topics[i].topic === row.topic) {
              index = i;
            }
          }
          stats.topics[index].presented += parseInt(row.num_presented);
          stats.topics[index].skipped += parseInt(row.num_skipped);
          stats.topics[index].correct += parseInt(row.num_correct);
          stats.topics[index].avgAttempts = (stats.topics[index].avgAttempts * stats.topics[index].presented + row.avg_attempts * row.num_presented) / (stats.topics[index].presented + row.num_presented);
          stats.topics[index].xp += parseInt(row.xp);
        } else {
          stats.topics.push({
            topic: getters.ProblemMetaData.topics.filter(function(topic) {return topic.topic === row.topic})[0].name,
            topicId: row.topic,
            foci: [],
            presented: parseInt(row.num_presented),
            skipped: parseInt(row.num_skipped),
            correct: parseInt(row.num_correct),
            avgAttempts: parseInt(row.avg_attempts),
            xp: parseInt(row.xp),
            streak: 0
          });
        }

        stats.topics[index].foci.push({
          focus: getters.ProblemMetaData.focuses.filter(function(focus) {return focus.focus === row.focus})[0].name,
          focusId: row.focus,
          presented: parseInt(row.num_presented),
          skipped: parseInt(row.num_skipped),
          correct: parseInt(row.num_correct),
          avgAttempts: parseInt(row.avg_attempts),
          xp: parseInt(row.xp),
          streak: parseInt(row.streak)
        });
      }
    });

    commit('setUserStats', stats);
  },
  async GetSubmittedProblems({commit, getters}) {
    let submitData = getters.ProblemMetaData;
    await axios.get('wp-json/physics_genie/contributor-problems', {headers: {'Authorization': 'Bearer ' + getters.Token}}).then((response) => {
      let problems = [];
      response.data.forEach(function(problem) {
        let problemTextShortened = problem.problem_text.replace(/\\\\/g, "\\").replace(/\\"/g, "'");

        if (problemTextShortened.length > 200) {
          problemTextShortened = problemTextShortened.slice(0, 200);
          if ((problemTextShortened.match(/\$/g)||[]).length % 2 === 1) {
            problemTextShortened = problemTextShortened.slice(0, problemTextShortened.lastIndexOf("$"));
          }

          problemTextShortened += " ...";
        }

        let errorMessage = "[[COULD NOT BE FOUND]]";

        let sourceName;
        if (submitData.sources.filter(function(source) {return source.source_id === problem.source})[0] === undefined) {
          sourceName = errorMessage;
        } else {
          sourceName = submitData.sources.filter(function(source) {return source.source_id === problem.source})[0].source;
        }

        let topicName;
        if (submitData.topics.filter(function(topic) {return topic.topic === problem.topic})[0] === undefined) {
          topicName = errorMessage;
        } else {
          topicName = submitData.topics.filter(function(topic) {return topic.topic === problem.topic})[0].name;
        }

        let mainFocusName;
        if (submitData.focuses.filter(function(focus) {return focus.focus === problem.main_focus})[0] === undefined) {
          mainFocusName = errorMessage;
        } else {
          mainFocusName = submitData.focuses.filter(function(focus) {return focus.focus === problem.main_focus})[0].name;
        }


        let foci = [];
        if (problem.other_foci !== null) {
          problem.other_foci.split("").forEach(function(otherFocus) {
            if (submitData.focuses.filter(function(focus) {return focus.focus === otherFocus})[0] === undefined) {
              foci.push(errorMessage);
            } else {
              foci.push(submitData.focuses.filter(function(focus) {return focus.focus === otherFocus})[0].name);
            }
          });
        }
        problems.push({
          problemID: problem.problem_id,
          problemText: problem.problem_text.replace(/\\\\/g, "\\").replace(/\\"/g, "'"),
          problemTextShortened: problemTextShortened,
          diagram: (problem.diagram === null) ? null : problem.diagram.replace(/\\\\/g, "\\").replace(/\\"/g, "'"),
          hintOne: problem.hint_one.replace(/\\\\/g, "\\").replace(/\\"/g, "'"),
          hintTwo: (problem.hint_two === null) ? null : problem.hint_two.replace(/\\\\/g, "\\").replace(/\\"/g, "'"),
          answer: problem.answer.replace(/\\\\/g, "\\").replace(/\\"/g, "'"),
          mustMatch: !!problem.must_match,
          solution: problem.solution.replace(/\\\\/g, "\\").replace(/\\"/g, "'"),
          solutionDiagram: (problem.solution_diagram === null) ? null : problem.solution_diagram.replace(/\\\\/g, "\\").replace(/\\"/g, "'"),
          topic: problem.topic,
          topicName: topicName,
          mainFocus: problem.main_focus,
          mainFocusName: mainFocusName,
          otherFoci: foci,
          source: problem.source,
          sourceName: sourceName,
          numberInSource: problem.number_in_source,
          submitter: problem.submitter,
          difficulty: problem.difficulty,
          calculus: problem.calculus,
          dateAdded: problem.date_added
        });
      });
      commit('setSubmittedProblems', problems)
    });
  },
  async SubmitProblem({commit, getters}) {
    await axios.post("wp-json/physics_genie/submit-problem", {
      problem_text: getters.CurrSubmission.problemText,
      diagram: (getters.CurrSubmission.diagramType === "file" ? getters.CurrSubmission.diagramFile.text : (getters.CurrSubmission.diagramType === "code" ? getters.CurrSubmission.diagram : "")),
      answer: getters.CurrSubmission.answer,
      must_match: getters.CurrSubmission.mustMatch ? "true" : "false",
      solution: getters.CurrSubmission.solution,
      solution_diagram: (getters.CurrSubmission.solutionDiagramType === "file" ? getters.CurrSubmission.solutionDiagramFile.text : (getters.CurrSubmission.solutionDiagramType === "code" ? getters.CurrSubmission.solutionDiagram : "")),
      hint_one: getters.CurrSubmission.hintOne,
      hint_two: getters.CurrSubmission.hintTwo,
      source: getters.CurrSubmission.source,
      number_in_source: getters.CurrSubmission.problemNumber,
      difficulty: getters.CurrSubmission.difficulty,
      calculus: getters.CurrSubmission.calculus,
      topic: getters.CurrSubmission.topic,
      main_focus: getters.CurrSubmission.mainFocus,
      other_foci: getters.CurrSubmission.otherFoci.join("")
    }, {headers: {'Authorization': 'Bearer ' + getters.Token}}).then(() => {
      commit('setCurrSubmission', {
        problemID: null,
        problemText: "",
        diagram: "",
        diagramFile: null,
        diagramType: "file",
        hintOne: "",
        hintTwo: "",
        hintTwoInclude: true,
        answer: "",
        mustMatch: false,
        solution: "",
        solutionDiagram: "",
        solutionDiagramFile: null,
        solutionDiagramType: "none",
        topic: "",
        mainFocus: "",
        otherFoci: [],
        source: "",
        category: "",
        author: "",
        sourceOther: "",
        problemNumber: "",
        difficulty: null,
        calculus: "None"
      });
    });
  },
  async EditProblem({commit, getters}) {
    await axios.put("wp-json/physics_genie/edit-problem", {
      problem_id: getters.CurrSubmissionEdit.problemID,
      problem_text: getters.CurrSubmissionEdit.problemText,
      diagram: (getters.CurrSubmissionEdit.diagramType === "file" ? getters.CurrSubmissionEdit.diagramFile.text : (getters.CurrSubmissionEdit.diagramType === "code" ? getters.CurrSubmissionEdit.diagram : "")),
      answer: getters.CurrSubmissionEdit.answer,
      must_match: getters.CurrSubmissionEdit.mustMatch ? "true" : "false",
      solution: getters.CurrSubmissionEdit.solution,
      solution_diagram: (getters.CurrSubmissionEdit.solutionDiagramType === "file" ? getters.CurrSubmissionEdit.solutionDiagramFile.text : (getters.CurrSubmissionEdit.solutionDiagramType === "code" ? getters.CurrSubmissionEdit.solutionDiagram : "")),
      hint_one: getters.CurrSubmissionEdit.hintOne,
      hint_two: getters.CurrSubmissionEdit.hintTwo,
      source: getters.CurrSubmissionEdit.source,
      number_in_source: getters.CurrSubmissionEdit.problemNumber,
      difficulty: getters.CurrSubmissionEdit.difficulty,
      calculus: getters.CurrSubmissionEdit.calculus,
      topic: getters.CurrSubmissionEdit.topic,
      main_focus: getters.CurrSubmissionEdit.mainFocus,
      other_foci: getters.CurrSubmissionEdit.otherFoci.join("")
    }, {headers: {'Authorization': 'Bearer ' + getters.Token}}).then(() => {
      commit('setCurrSubmissionEdit', {
        problemID: null,
        problemText: "",
        diagram: "",
        diagramFile: null,
        diagramType: "file",
        hintOne: "",
        hintTwo: "",
        hintTwoInclude: true,
        answer: "",
        mustMatch: false,
        solution: "",
        solutionDiagram: "",
        solutionDiagramFile: null,
        solutionDiagramType: "none",
        topic: "",
        mainFocus: "",
        otherFoci: [],
        source: "",
        category: "",
        author: "",
        sourceOther: "",
        problemNumber: "",
        difficulty: null,
        calculus: "None"
      });
    });
  },
  async submitAttempt({getters}) {
    await axios.post("wp-json/physics_genie/submit-attempt", {
      problem_id: getters.CurrProblem.problemID,
      num_attempts: getters.PastAnswers.length,
      correct: getters.Result === "correct" ? "true" : "false",
      skipped: getters.Result === "gave up" ? "true" : "false",
      topic: getters.CurrProblem.topic,
      focus: getters.CurrProblem.mainFocus,
      difficulty: getters.CurrProblem.difficulty,
      first_in_focus: (getters.UserStats.topics.filter(function(topic) { return topic.topicId === getters.CurrProblem.topic; }).length === 0 || getters.UserStats.topics.filter(function(topic) { return topic.topicId === getters.CurrProblem.topic; })[0].foci.filter(function(focus) {return focus.focusId === getters.CurrProblem.mainFocus;}).length === 0) ? 'true' : 'false'
    },  {headers: {'Authorization': 'Bearer ' + getters.Token}});
  }
};
const mutations = {
  setProcessing(state, processing) {
    state.processing = processing;
  },
  addConfirmation(state, confirmation) {
    state.confirmations.push(confirmation);
  },
  removeConfirmation(state, id) {
    for (let i = 0; i < state.confirmations.length; i++) {
      if (state.confirmations[i].id === id) {
        state.confirmations.splice(i, 1);
        break;
      }
    }
  },
  setWindowHeight(state) {
    state.windowHeight = window.innerHeight;
  },
  setUserSetup(state, setup) {
    state.userSetup = setup;
  },
  setLongestStreaks(state, streaks) {
    state.longestWinstreak = streaks.winstreak;
    state.longestLosestreak = streaks.losestreak;
  },
  setProblemMetaData(state, data) {
    state.problemMetaData = data;
  },
  setCurrProblem(state, problem) {
    state.currProblem = problem;
  },
  setUserStats(state, stats) {
    state.userStats = stats;
  },
  setSubmittedProblems(state, problems) {
    state.submittedProblems = problems;
  },
  setCurrSubmission(state, currSubmission) {
    state.currSubmission = currSubmission;
  },
  setCurrSubmissionEdit(state, currSubmissionEdit) {
    state.currSubmissionEdit = currSubmissionEdit;
  },
  setPastAnswers(state, pastAnswers) {
    state.pastAnswers = pastAnswers;
  },
  setCurrAnswer(state, currAnswer) {
    state.currAnswer = currAnswer;
  },
  setResult(state, result) {
    state.result = result;
  }
};
export default {
  state,
  getters,
  actions,
  mutations
};
