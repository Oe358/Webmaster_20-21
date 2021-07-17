<template>
  <div class = "container">
    <Menu />
    <User />
    <div id = "exit" v-on:click = "$router.push('/submit')">
      <div class = "line one"></div>
      <div class = "line two"></div>
      <p>Exit {{ currSubmission.problemID === null ? "Submit" : "Edit" }} Portal</p>
    </div>
    <div v-if = "problemPreview !== null" class = "preview" v-bind:style = "{height: windowHeight + 'px'}">
      <div class = "preview-container">
        <div class = "view-box">
          <Problem v-bind:problem = "problemPreview" v-bind:official = "false" class = "problem" />
        </div>
        <button v-on:click = "problemPreview = null" class = "exit"><span>Exit Preview</span><i class = "fa fa-times"></i></button>
      </div>
    </div>
    <FullEdit v-bind = "fullEdit" v-on:exit = "fullEditExit" />
    <div id = "errors" v-if = "errors.length > 0">
      <p>Please address the following errors before {{ currSubmission.problemID === null ? "submitting" : "updating" }} again:</p>
      <ul>
        <li v-for = "error in errors" v-bind:key = "error">{{ error }}</li>
      </ul>
    </div>
    <div id = "problem-submit">
      <div class = "flex">
        <div class = "problem-div content">
          <h3>Problem</h3>
          <div class = "input-container">
            <textarea type = "text" id = "problem-text" name = "problem-text" v-model = "currSubmission.problemText"></textarea>
            <button class = "expand problem-text" v-on:click = "fullEditSet('problemText')"><i class = "fa fa-reply"></i>Edit Full Screen</button>
          </div>
          <div class = "input-container">
            <h6>Diagram <span class = "smaller">(svg)</span></h6>
            <div class = "selector-buttons diagram">
              <div class = "indicator" v-bind:style = "(currSubmission.diagramType === 'file') ? {left: '0'} : ((currSubmission.diagramType === 'code') ? {left: '33%'} : {left: '66%'})"><div></div></div>
              <button class = "file" v-bind:class = "{active: (currSubmission.diagramType === 'file')}" v-on:click = "setCurrSubmissionField('diagramType', 'file')">File</button>
              <button class = "code" v-bind:class = "{active: (currSubmission.diagramType === 'code')}" v-on:click = "setCurrSubmissionField('diagramType', 'code')">Code</button>
              <button class = "none" v-bind:class = "{active: (currSubmission.diagramType === 'none')}" v-on:click = "setCurrSubmissionField('diagramType', 'none')">None</button>
            </div>
            <div class = "flex-options diagram">
              <div class = "diagram-file" v-if = "currSubmission.diagramType === 'file'">
                <label for = "diagram" id = "diagram-file-label" class = "button"><i class = "fa fa-upload"></i><span v-if = "currSubmission.diagramFile === null">Upload File</span><span v-else>Change File</span>
                  <input type = "file" id = "diagram" name = "diagram" accept = ".svg" v-on:change = "fileUploaded($event)">
                </label>
                <div id = "file-name" v-bind:style = "(currSubmission.diagramFile !== null) ? {color: '#111521', borderBottom: '1px dashed #111521', paddingBottom: '5px'} : ''">
                  <span v-if = "currSubmission.diagramFile === null">File must be of type .svg</span>
                  <span v-else>{{ currSubmission.diagramFile.name }}</span>
                  <i v-if = "currSubmission.diagramFile !== null" v-on:click = "fullEditSet('diagramFile')" class = "fa fa-eye" title = "Preview Diagram" style = "display: inline-block; float: right; margin-top: 10px; cursor: pointer;"></i>
                </div>
              </div>
              <div v-if = "currSubmission.diagramType === 'code'">
                <textarea type = "text" id = "diagram-code" name = "diagram-code" v-model = "currSubmission.diagram"></textarea>
                <button class = "expand diagram" v-on:click = "fullEditSet('diagram')"><i class = "fa fa-reply"></i>Edit Full Screen</button>
              </div>

            </div>
          </div>
          <div class = "input-container">
            <h6>Hint One</h6>
            <input type = "text" id = "hint-one" name = "hint-one" v-model = "currSubmission.hintOne">
          </div>
          <div class = "input-container">
            <h6>Hint Two</h6>
            <div class = "selector-buttons hint-two">
              <div class = "indicator" v-bind:style = "currSubmission.hintTwoInclude ? {left: '0'} : {left: '50%'}"><div></div></div>
              <button class = "include" v-bind:class = "{active: currSubmission.hintTwoInclude}" v-on:click = "setCurrSubmissionField('hintTwoInclude', true)">Include</button>
              <button class = "none" v-bind:class = "{active: !currSubmission.hintTwoInclude}" v-on:click = "setCurrSubmissionField('hintTwoInclude', false)">None</button>
            </div>
            <div class = "flex-options hint-two" v-if = "currSubmission.hintTwoInclude">
              <input type = "text" id = "hint-two" name = "hint-two" v-model = "currSubmission.hintTwo">
            </div>
          </div>
        </div>
        <div class = "answer-div content">
          <h3>Answer</h3>
          <div class = "input-container">
            <mathlive-mathfield class = "math-input" v-on:focus = "mathInputFocusStyle = [{boxShadow: '0 0 10px 0 rgba(40, 46, 91, 0.4)'}]" v-on:blur = "mathInputFocusStyle = null" v-bind:style = "mathInputFocusStyle" v-model = "currSubmission.answer">{{ currSubmission.answer }}</mathlive-mathfield>
          </div>
          <div class = "input-container">
            <div class = "selector-buttons student-answer">
              <div class = "indicator" v-bind:style = "!currSubmission.mustMatch ? {left: '0'} : {left: '50%'}"><div></div></div>
              <button class = "error" v-bind:class = "{active: !currSubmission.mustMatch}" v-on:click = "mustMatchExactly(false)">{{ algebraicAnswer ? "Algebraically Equivalent" : "Error Margin" }}</button>
              <button class = "must-match" v-bind:class = "{active: currSubmission.mustMatch}" v-on:click = "mustMatchExactly(true)">Must Match Exactly</button>
            </div>
            <div class = "flex-options student-answer">
              <div v-if = "currSubmission.mustMatch" class = "must-match">
                <p>Warning: The student's answer must match your inputted one exactly (form and value) to be marked correct.{{ algebraicAnswer ? " If you merely want the expression to be equivalent, select 'Algebraically Equivalent'." : " If you merely want the value to match, select 'Error Margin' and set it to 0." }}</p>
              </div>
              <div v-else-if = "!algebraicAnswer" class = "error-margin">
                <input type = "range" min = "0" max = "20" class = "slider" v-model = "currSubmission.error">
                <span class = "slider-value">Error: {{ currSubmission.error }}%</span>
              </div>
              <div v-else class = "algebraically-equivalent">
                <p>To ensure the expression equivalency engine works properly, be sure to input your answer in its most simplified form and to be as clear as possible (e.g. include parentheses around trigonometric functions, etc.). In addition, if the answer is a pretty complex expression, it may be safer to convert it to a numerical answer instead – it is suggested you test a couple alternate forms in the "Preview" before submitting to see if this is necessary.</p>
              </div>
            </div>
          </div>
          <div class = "input-container solution">
            <h6>Solution <span class = "smaller">(LaTeX)</span></h6>
            <textarea type = "text" id = "solution" name = "solution" v-model = "currSubmission.solution"></textarea>
            <button class = "expand solution" v-on:click = "fullEditSet('solution')"><i class = "fa fa-reply"></i>Edit Full Screen</button>
          </div>
          <div class = "input-container">
            <h6>Solution Diagram <span class = "smaller">(svg)</span></h6>
            <div class = "selector-buttons diagram">
              <div class = "indicator" v-bind:style = "(currSubmission.solutionDiagramType === 'file') ? {left: '0'} : ((currSubmission.solutionDiagramType === 'code') ? {left: '33%'} : {left: '66%'})"><div></div></div>
              <button class = "file" v-bind:class = "{active: (currSubmission.solutionDiagramType === 'file')}" v-on:click = "setCurrSubmissionField('solutionDiagramType', 'file')">File</button>
              <button class = "code" v-bind:class = "{active: (currSubmission.solutionDiagramType === 'code')}" v-on:click = "setCurrSubmissionField('solutionDiagramType', 'code')">Code</button>
              <button class = "none" v-bind:class = "{active: (currSubmission.solutionDiagramType === 'none')}" v-on:click = "setCurrSubmissionField('solutionDiagramType', 'none')">None</button>
            </div>
            <div class = "flex-options diagram">
              <div class = "diagram-file" v-if = "currSubmission.solutionDiagramType === 'file'">
                <label for = "solution-diagram" id = "solution-diagram-file-label" class = "button"><i class = "fa fa-upload"></i><span v-if = "currSubmission.solutionDiagramFile === null">Upload File</span><span v-else>Change File</span>
                  <input type = "file" id = "solution-diagram" name = "solution-diagram" accept = ".svg" v-on:change = "solutionFileUploaded($event)">
                </label>
                <div id = "solution-file-name" v-bind:style = "(currSubmission.solutionDiagramFile !== null) ? {color: '#111521', borderBottom: '1px dashed #111521', paddingBottom: '5px'} : ''">
                  <span v-if = "currSubmission.solutionDiagramFile === null">File must be of type .svg</span>
                  <span v-else>{{ currSubmission.solutionDiagramFile.name }}</span>
                  <i v-if = "currSubmission.solutionDiagramFile !== null" v-on:click = "fullEditSet('solutionDiagramFile')" class = "fa fa-eye" title = "Preview Diagram" style = "display: inline-block; float: right; margin-top: 10px; cursor: pointer;"></i>
                </div>
              </div>
              <div v-if = "currSubmission.solutionDiagramType === 'code'">
                <textarea type = "text" id = "solution-diagram-code" name = "diagram-code" v-model = "currSubmission.solutionDiagram"></textarea>
                <button class = "expand diagram" v-on:click = "fullEditSet('solutionDiagram')"><i class = "fa fa-reply"></i>Edit Full Screen</button>
              </div>

            </div>
          </div>
        </div>
      </div>
      <div class = "flex">
        <div class = "topic-div content">
          <h3>Topic</h3>
          <div class = "input-container topic">
            <select id = "topic" name = "topic" v-bind:style = "(currSubmission.topic !== '') ? {color: 'black'} : {color: '#929292'}" v-on:change = "function(event) {setCurrSubmissionField('topic', event.target.value)}">
              <option disabled selected value> -- Select a Topic -- </option>
              <option v-for = "topic in submitData.topics" v-bind:key = "topic.name" v-bind:selected = "topic.topic === currSubmission.topic" v-bind:value = "topic.topic">{{ topic.name }}</option>
            </select>
          </div>
          <div class = "input-container">
            <h6>Main Focus</h6>
            <select id = "main-focus" name = "main-focus" v-bind:style = "(currSubmission.mainFocus !== '') ? {color: 'black'} : {color: '#929292'}" v-on:change = "function(event) {setCurrSubmissionField('mainFocus', event.target.value)}">
              <option disabled selected value> -- Select a Focus -- </option>
              <option v-for = "focus in submitData.focuses" v-bind:key = "focus.name" v-bind:selected = "focus.focus === currSubmission.mainFocus" v-bind:value = "focus.focus">{{ focus.name }}</option>
            </select>
          </div>
          <div class = "input-container">
            <h6>Other Foci</h6>
            <div class = "other-foci">
              <div v-for = "(focus, index) in currSubmission.otherFoci" class = "other-focus" v-bind:key = "index">
                <select v-bind:name = "'focus_' + index" v-on:change = "focusesChanged($event, index)">
                  <option v-for = "(possibleFocus, i) in submitData.focuses" v-bind:key = "i" v-bind:selected = "focus === possibleFocus.focus" v-bind:disabled = "focus !== possibleFocus.focus && (currSubmission.otherFoci.includes(possibleFocus.focus))" v-bind:value = "possibleFocus.focus">{{ possibleFocus.name }}</option>
                </select>
                <i class = "fa fa-times" style = "color: red; cursor: pointer;" v-on:click = "removeFocus(index)"></i>
              </div>
              <button v-on:click = "addFocus" class = "add-focus"><i class = "fa fa-plus"></i>Add Focus</button>
            </div>
          </div>
        </div>
        <div class = "source-div content">
          <h3>Source</h3>
          <div class = "input-container source">
            <select id = "source" name = "source" v-bind:style = "(currSubmission.source !== '') ? {color: 'black'} : {color: '#929292'}" v-on:change = "function(event) {setCurrSubmissionField('source', event.target.value)}">
              <option disabled selected value> -- Select a Source -- </option>
              <optgroup v-for = "category in submitData.source_categories" v-bind:key = "category.category" v-bind:label = "category.category">
                <option v-for = "source in submitData.sources.filter(function(sourceComparator) {return sourceComparator.category === category.category})" v-bind:key = "source.source" v-bind:selected = "source.source_id === currSubmission.source" v-bind:value = "source.source_id">{{ source.source }} ({{ source.author }})</option>
              </optgroup>
              <option v-bind:value = "'other'" id = "source-other-option" v-bind:selected = "currSubmission.source === 'other'">Other...</option>
            </select>
            <div class = "source-other" v-if = "currSubmission.source === 'other'">
              <div>
                <i class = "fa fa-reply" style = "transform: rotate(180deg)"></i>
                <p>Category: </p>
                <select type = "text" class = "source-other-select source-other" name = "source-other-select" v-bind:style = "(currSubmission.category !== '') ? {color: 'black'} : {color: '#929292'}" v-on:change = "function(event) {setCurrSubmissionField('category', event.target.value)}">
                  <option disabled selected value> -- Select a Category -- </option>
                  <option v-for = "category in submitData.source_categories" v-bind:key = "category.category" v-bind:selected = "category.category === currSubmission.category" v-bind:value = "category.category">{{ category.category }}</option>
                </select>
              </div>
              <div>
                <i class = "fa fa-reply" style = "transform: rotate(180deg)"></i>
                <p>Source:</p>
                <input type = "text" class = "source-other" id = "source-other" name = "source-other" v-model = "currSubmission.sourceOther">
              </div>
              <div>
                <i class = "fa fa-reply" style = "transform: rotate(180deg)"></i>
                <p>Author: </p>
                <input type = "text" class = "author-other" name = "author-other" v-model = "currSubmission.author">
              </div>

            </div>
          </div>
          <div class = "input-container">
            <h6>Problem Number in Source</h6>
            <input type = "text" id = "problem-number" name = "problem-number" v-model = "currSubmission.problemNumber">
          </div>
        </div>
        <div class = "other-div content">
          <h3>Other</h3>
          <div class = "input-container">
            <h6>Difficulty</h6>
            <div id = "difficulty">
              <i class = "fa" v-for = "i in 5" v-bind:key = "i" v-bind:class = "(currSubmission.difficulty >= i || difficultyHover >= i) ? 'fa-star' : 'fa-star-o'"
                 v-bind:style = "(currSubmission.difficulty >= i) ? {color: 'rgba(40, 83, 128, 0.8)'} : ((difficultyHover >= i) ? {color: 'rgba(40, 83, 128, 0.4)'} : {color: 'rgb(170, 170, 170)'})"
                 v-on:click = "setDifficulty(i)" v-on:mouseover = "difficultyHover = i" v-on:mouseout = "difficultyHover = 0"></i>
            </div>
          </div>
          <div class = "input-container">
            <h6>Calculus?</h6>
            <div class = "selector-buttons calculus">
              <div class = "indicator" v-bind:style = "(currSubmission.calculus === 'None') ? {left: '0'} : ((currSubmission.calculus === 'Helps') ? {left: '33%'} : {left: '66%'})"><div></div></div>
              <button class = "none" v-bind:class = "{active: (currSubmission.calculus === 'None')}" v-on:click = "setCurrSubmissionField('calculus', 'None')">None</button>
              <button class = "helps" v-bind:class = "{active: (currSubmission.calculus === 'Helps')}" v-on:click = "setCurrSubmissionField('calculus', 'Helps')">Helps</button>
              <button class = "required" v-bind:class = "{active: (currSubmission.calculus === 'Required')}" v-on:click = "setCurrSubmissionField('calculus', 'Required')">Required</button>
            </div>
          </div>
        </div>
        <button class = "button orange" v-on:click = "submit"><i class = "fa fa-database"></i>{{ currSubmission.problemID === null ? "SUBMIT" : "UPDATE" }}</button>
        <button class = "button" style = "margin-left: 20px;" v-on:click = "previewProblem"><i class = "fa fa-eye"></i>PREVIEW</button>
        <button v-if = "currSubmission.problemID === null" class = "button" style = "margin-left: 20px;" v-on:click = "clear">CLEAR ALL</button>
        <button v-else class = "button" style = "margin-left: 20px;" v-on:click = "reset">RESET CHANGES</button>
      </div>
    </div>
  </div>
</template>

<script>

  import Menu from "../components/Menu";
  import User from "../components/User";
  import Problem from "../components/Problem";
  import FullEdit from "../components/FullEdit";
  import Mathml2latex from 'mathml-to-latex';


  export default {
    name: "SubmitPortal",
    components: {
      Menu,
      User,
      FullEdit,
      Problem
    },
    data() {
      return {
        fullEdit: {
          text: "",
          open: false,
          type: ""
        },
        mathInputFocusStyle: null,
        errors: [],
        difficultyHover: null,
        submitData: this.$store.getters.ProblemMetaData,
        problemPreview: null,
        windowHeight: window.innerHeight
      }
    },
    computed: {
      currSubmission: {
        get() {
          if (this.$route.params.id === undefined) {
            return this.$store.getters.CurrSubmission;
          } else {
            return this.$store.getters.CurrSubmissionEdit
          }
        },
        set(value) {
          if (this.$route.params.id === undefined) {
            this.$store.commit('setCurrSubmission', value);
          } else {
            this.$store.commit('setCurrSubmissionEdit', value);
          }
        }
      },
      algebraicAnswer: function() {
        const regexp = new RegExp(/((?<!\\|[A-Za-z])[A-Za-z]+)|(\\alpha)|(\\beta)|(\\[Gg]amma)|(\\[Dd]elta)|(\\epsilon)|(\\varepsilon)|(\\zeta)|(\\eta)|(\\[Tt]heta)|(\\vartheta)|(\\iota)|(\\kappa)|(\\[Ll]ambda)|(\\mu)|(\\nu)|(\\[Xx]i)|(\\[Pp]i)|(\\rho)|(\\varrho)|(\\[Ss]igma)|(\\tau)|(\\[Uu]psilon)|(\\[Pp]hi)|(\\varphi)|(\\chi)|(\\[Pp]si)|(\\[Oo]mega)/);
        return regexp.test(this.currSubmission.answer);
      }
    },
    methods: {
      submit: async function () {
        this.$store.commit('setProcessing', true);

        this.errors = [];

        if (this.currSubmission.problemText === "") {
          this.errors.push("Please enter the problem text (latex)");
        }

        if (this.currSubmission.diagramType === "file" && this.currSubmission.diagramFile === null) {
          this.errors.push("Please upload a non-empty .svg diagram file or select a different diagram option");
        } else if (this.currSubmission.diagramType === "code" && this.currSubmission.diagram === "") {
          this.errors.push("Please enter the diagram svg markup code or select a different diagram option");
        }

        if (this.currSubmission.hintOne === "") {
          this.errors.push("Please enter the first hint");
        }

        if (this.currSubmission.hintTwoInclude && this.currSubmission.hintTwo === "") {
          this.errors.push("Please enter the second hint or set it to \"none\"");
        }

        if (this.currSubmission.answer === "" || this.currSubmission.answer === "<math xmlns=\"http://www.w3.org/1998/Math/MathML\"/>") {
          this.errors.push("Please enter the answer");
        }

        if (this.currSubmission.solution === "") {
          this.errors.push("Please enter the solution text (latex)");
        }

        if (this.currSubmission.solutionDiagramType === "file" && this.currSubmission.solutionDiagramFile === null) {
          this.errors.push("Please upload a non-empty .svg solution diagram file or select a different solution diagram option");
        } else if (this.currSubmission.solutionDiagramType === "code" && this.currSubmission.solutionDiagram === "") {
          this.errors.push("Please enter the diagram svg markup code or select a different solution diagram option");
        }

        if (this.currSubmission.topic === "") {
          this.errors.push("Please select a topic");
        }

        if (this.currSubmission.mainFocus === "") {
          this.errors.push("Please select a main focus");
        }

        if (this.currSubmission.source === "") {
          this.errors.push("Please select a source");
        } else if (this.currSubmission.source === "other" && this.currSubmission.category === "") {
          this.errors.push("Please enter the category of your custom source or select a source from the dropdown menu");
        } else if (this.currSubmission.source === "other" && this.currSubmission.sourceOther === "") {
          this.errors.push("Please enter the name of your custom source or select a source from the dropdown menu");
        } else if (this.currSubmission.source === "other" && this.currSubmission.author === "") {
          this.errors.push("Please enter the author (can be organization) of your custom source or select a source from the dropdown menu");
        }

        if (this.currSubmission.difficulty === null) {
          this.errors.push("Please select a difficulty");
        }

        if (this.errors.length === 0) {
          if (this.$route.params.id === undefined) {
            await this.$store.dispatch('SubmitProblem');
            await this.$store.dispatch('GetProblemMetadata');
            await this.$store.dispatch('GetSubmittedProblems');
            this.$store.dispatch('Confirmation', "Problem successfully submitted");
          } else {
            await this.$store.dispatch('EditProblem');
            await this.$store.dispatch('GetProblemMetadata');
            await this.$store.dispatch('GetSubmittedProblems');
            this.$store.dispatch('Confirmation', "Problem successfully edited");
          }
          this.$store.commit('setProcessing', false);
          this.$router.push("/submit");
          window.scrollTo({top: 0, left: 0});
        } else {
          this.$store.commit('setProcessing', false);
          window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
        }

      },
      setCurrSubmissionField: function(field, value) {
        this.currSubmission[field] = value;
      },
      fullEditSet: function(type) {
        if (type === "diagramFile") {
          this.fullEdit.text = this.currSubmission.diagramFile.text;
        } else if (type === "solutionDiagramFile") {
          this.fullEdit.text = this.currSubmission.solutionDiagramFile.text;
        } else {
          this.fullEdit.text = this.currSubmission[type];
        }
        this.fullEdit.open = true;
        this.fullEdit.type = type;
      },
      fullEditExit: function(text, type) {
        this.fullEdit.open = false;
        if (type !== "diagramFile" && type !== "solutionDiagramFile") {
          this.currSubmission[type] = text;
        }
      },
      fileUploaded: function(event) {
        const file = event.target.files[0];
        let self = this;

        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");

        reader.onload = function (evt) {
          self.currSubmission.diagramFile = {
            name: file.name,
            size: file.size,
            type: file.type,
            text: evt.target.result
          };
        };

        reader.onerror = function (evt) {
          alert("Sorry! There was an error loading the file.")
        };
      },
      solutionFileUploaded: function(event) {
        const file = event.target.files[0];
        let self = this;

        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");

        reader.onload = function (evt) {
          self.currSubmission.solutionDiagramFile = {
            name: file.name,
            size: file.size,
            type: file.type,
            text: evt.target.result
          };

        };

        reader.onerror = function (evt) {
          alert("Sorry! There was an error loading the file.")
        };
      },
      mustMatchExactly: function(mustMatch) {
        this.currSubmission.mustMatch = mustMatch;
      },
      setDifficulty: function(difficulty) {
        this.currSubmission.difficulty = difficulty;
      },
      addFocus: function() {
        let i = 0;
        while(this.currSubmission.otherFoci.includes(this.submitData.focuses[i].focus)) {
          i++;
        }
        this.currSubmission.otherFoci.push(this.submitData.focuses[i].focus);
      },
      focusesChanged: function(event, index) {
        this.$set(this.currSubmission.otherFoci, index, event.target.value);
      },
      removeFocus: function(index) {
        this.currSubmission.otherFoci.splice(index, 1);
      },
      clear: function() {
        if (confirm("Are you sure you would like to clear the current submission? This cannot be undone")) {
          this.currSubmission = {
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
            error: 5,
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
          };
          window.scrollTo({top: 0, left: 0});
        }
      },
      reset: function() {
        if (confirm("Are you sure you would like to reset the current edits? This cannot be undone")) {
          this.$store.commit('setProcessing', true);
          let self = this;
          if (this.$route.params.id !== undefined) {
            let problem = this.$store.getters.SubmittedProblems.filter(function(problem) {return problem.problemID === self.$route.params.id})[0];
            let otherFoci = [];
            problem.otherFoci.forEach(function(otherFocus) {
              otherFoci.push(self.submitData.focuses.filter(function(focus) {return focus.name === otherFocus})[0].focus);
            });
            this.currSubmission = {
              problemID: parseInt(this.$route.params.id),
              problemText: problem.problemText,
              diagram: problem.diagram === null ? "" : problem.diagram,
              diagramFile: null,
              diagramType: problem.diagram === null ? "none" : "code",
              hintOne: problem.hintOne,
              hintTwo: problem.hintTwo === null ? "": problem.hintTwo,
              hintTwoInclude: problem.hintTwo !== null,
              answer: problem.answer,
              mustMatch: problem.mustMatch,
              error: problem.error,
              solution: problem.solution,
              solutionDiagram: problem.solutionDiagram === null ? "" : problem.solutionDiagram,
              solutionDiagramFile: null,
              solutionDiagramType: problem.solutionDiagram === null ? "none" : "code",
              topic: problem.topic,
              mainFocus: problem.mainFocus,
              otherFoci: otherFoci,
              source: problem.source,
              category: "",
              author: "",
              sourceOther: "",
              problemNumber: problem.numberInSource,
              difficulty: problem.difficulty,
              calculus: problem.calculus
            };
          }
          window.scrollTo({top: 0, left: 0});
          self.$store.commit('setProcessing', false);
          self.$store.dispatch('Confirmation', "Current edits successfully reset");
        }
      },
      previewProblem: function() {
        let self = this;
        this.problemPreview = Object.assign({}, this.currSubmission);

        this.problemPreview.diagram = ((this.problemPreview.diagramType === "file" && this.problemPreview.diagramFile !== null) ? this.problemPreview.diagramFile.text : (this.problemPreview.diagramType === "code" ? this.problemPreview.diagram : ""));
        this.problemPreview.solutionDiagram = ((this.problemPreview.solutionDiagramType === "file" && this.problemPreview.solutionDiagramFile !== null) ? this.problemPreview.solutionDiagramFile.text : (this.problemPreview.solutionDiagramType === "code" ? this.problemPreview.solutionDiagram : ""));

        let errorMessage = "";

        if (this.submitData.topics.filter(function(topic) {return topic.topic === self.problemPreview.topic})[0] === undefined) {
          this.problemPreview.topicName = errorMessage;
        } else {
          this.problemPreview.topicName = this.submitData.topics.filter(function(topic) {return topic.topic === self.problemPreview.topic})[0].name;
        }

        if (this.submitData.focuses.filter(function(focus) {return focus.focus === self.problemPreview.mainFocus})[0] === undefined) {
          this.problemPreview.mainFocusName = errorMessage;
        } else {
          this.problemPreview.mainFocusName = this.submitData.focuses.filter(function(focus) {return focus.focus === self.problemPreview.mainFocus})[0].name;
        }


        let foci = [];
        this.problemPreview.otherFoci.forEach(function(otherFocus) {
          if (self.submitData.focuses.filter(function(focus) {return focus.focus === otherFocus})[0] === undefined) {
            foci.push(errorMessage);
          } else {
            foci.push(self.submitData.focuses.filter(function(focus) {return focus.focus === otherFocus})[0].name);
          }
        });

        this.problemPreview.otherFoci = foci;
      }
    },
    mounted() {
      let self = this;
      if (this.$route.params.id !== undefined) {
        let problem = this.$store.getters.SubmittedProblems.filter(function(problem) {return problem.problemID === self.$route.params.id})[0];
        let otherFoci = [];
        problem.otherFoci.forEach(function(otherFocus) {
          otherFoci.push(self.submitData.focuses.filter(function(focus) {return focus.name === otherFocus})[0].focus);
        });
        this.currSubmission = {
          problemID: parseInt(this.$route.params.id),
          problemText: problem.problemText,
          diagram: problem.diagram === null ? "" : problem.diagram,
          diagramFile: null,
          diagramType: problem.diagram === null ? "none" : "code",
          hintOne: problem.hintOne,
          hintTwo: problem.hintTwo === null ? "": problem.hintTwo,
          hintTwoInclude: problem.hintTwo !== null,
          answer: (problem.answer.substring(0, 5) === "<math" ? Mathml2latex.convert(problem.answer) : problem.answer),
          mustMatch: problem.mustMatch,
          error: problem.error,
          solution: problem.solution,
          solutionDiagram: problem.solutionDiagram === null ? "" : problem.solutionDiagram,
          solutionDiagramFile: null,
          solutionDiagramType: problem.solutionDiagram === null ? "none" : "code",
          topic: problem.topic,
          mainFocus: problem.mainFocus,
          otherFoci: otherFoci,
          source: problem.source,
          category: "",
          author: "",
          sourceOther: "",
          problemNumber: problem.numberInSource,
          difficulty: problem.difficulty,
          calculus: problem.calculus
        };
      }
    }
  }
</script>

<style scoped>

  button {
    outline: none;
    cursor: pointer;
  }

  .button {
    z-index: 1;
  }

  select {
    padding: 0 15px;
    cursor: pointer;
  }

  .container {
    background: white;
    position: relative;
    box-sizing: border-box;
    padding: 100px 100px 100px 200px;
  }

  #exit {
    cursor: pointer;
    position: absolute;
    top: 55px;
    left: 200px;
    height: 20px;
  }

  #exit .line {
    width: 1px;
    height: 20px;
    background: black;
    position: absolute;
    top: 0;
    left: 10px;
    transition: transform .3s ease;
  }

  #exit:hover .line.one {
    transform: rotate(45deg);
  }

  #exit:hover .line.two {
    transform: rotate(-45deg);
  }

  #exit p {
    margin-left: 17px;
    font-family: "Montserrat", sans-serif;
    font-size: 15px;
    border-bottom: 1px dotted black;
    transition: border .3s ease, margin .3s ease;
  }

  #exit:hover p {
    border-bottom: 1px solid black;
    margin-left: 25px;
  }

  .preview {
    position: fixed;
    top: 0;
    left: 50px;
    width: 100%;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .preview .preview-container {
    width: 75%;
    border-radius: 50px;
    position: relative;
    background: white;
    padding: 80px;
    box-sizing: border-box;
    height: auto;
    max-height: 85%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 10px 2px rgba(17, 21, 33, 0.3);
  }

  .preview .view-box {
    width: 100%;
    height: 100%;
    padding: 0 80px;
    margin: 0;
    overflow-y: auto;
  }

  .preview .problem {

  }

  .preview .exit {
    position: absolute;
    right: 35px;
    top: 25px;
    background: none;
    outline: none;
    font-size: 20px;
    cursor: pointer;
    color: #ff3f49;
    border-radius: 10px;
    border: 1px solid #ff3f49;
    transition: transform .3s ease;
    display: flex;
    height: 35px;
    padding: 0 7px;
    justify-content: center;
    align-items: center;
    flex-direction: row;
  }

  .preview .exit span {
    width: 0;
    display: inline-block;
    overflow: hidden;
    font-size: 13px;
    margin: 0;
    transition: width .3s ease, margin-right .3s ease;
  }

  .preview .exit:hover span {
    width: inherit;
    margin: 0 5px;
  }

  .preview .exit:hover .fa {
    transform: rotate(90deg);
  }

  #errors {
    background: rgba(255, 207, 209, 0.6);
    width: 70%;
    color: #ff6469;
    font-size: 13px;
    padding: 20px 35px;
    margin-bottom: 20px;
    margin-top: 20px;
    box-shadow: -0.1px 0 10px rgba(120, 120, 120, 0.5);
  }

  #errors p {
    color: #ff6469;
    font-family: "Montserrat", sans-serif;
    font-size: 18px;
  }

  #errors ul {
    margin: 10px 50px 0 50px;
    font-family: "Montserrat", sans-serif;
  }

  #errors ul li {
    margin: 3px 0;
  }

  #problem-submit {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    width: inherit;
  }

  h3 {
    font-family: "Nanum Gothic", sans-serif;
    font-size: 40px;
    color: black;
    font-weight: 500;
    padding-bottom: 10px;
    margin-bottom: 30px;
    position: relative;
  }

  h3:before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 80%;
    height: 2px;
    background: #111521;
  }

  .flex {
    width: 100%;
    padding: 0 !important;
    margin: 0;
  }

  .content {
    padding: 30px;
  }

  .input-container {
    width: 100%;
    margin-bottom: 20px;
  }

  .input-container h6 {
    color: black;
    font-weight: 200;
    margin-bottom: 5px;
    font-size: 19px;
    font-family: "Nunito", sans-serif;
    display: block;
  }

  .input-container h6 .smaller {
    font-size: 14px;
    font-style: italic;
  }

  .input-container > * {
    width: 100%;
  }

  .input-container input[type = "text"] {
    border: 1px solid rgba(17, 21, 33, 0.51);
    padding: 10px;
    box-sizing: border-box;
    width: 100%;
    font-family: "Montserrat", sans-serif;
    font-size: 12px;
    color: rgb(17, 21, 33);
    outline: none;
    transition: border .15s ease, box-shadow .15s ease;
  }

  .input-container input[type = "text"]:focus {
    border: 1px solid rgba(40, 83, 128, 0.61);
    color: #285380;
    box-shadow: 0 0 10px 0 rgba(40, 83, 128, 0.61);
  }

  .input-container textarea {
    border: 1px solid rgba(17, 21, 33, 0.51);
    padding: 10px;
    box-sizing: border-box;
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    height: 120px;
    color: rgb(29, 34, 41);
    margin: 0;
    resize: vertical;
    outline: none;
    transition: border .15s ease, box-shadow .15s ease;
  }

  .input-container textarea:focus {
    border: 1px solid rgba(29, 34, 41, 0.61);
    box-shadow: 0 0 10px 0 rgba(29, 34, 41, 0.61);
  }

  .input-container .expand {
    background: none;
    border: none;
    float: right;
    width: auto;
    color: rgb(170, 170, 170);
    font-family: "Nunito", sans-serif;
    font-size: 12px;
    border-right: 1px solid #b9b9b9;
    border-bottom: 1px solid #b9b9b9;
    margin-top: -8px;
    padding: 5px 5px 5px 20px;
    border-bottom-right-radius: 5px;
    transition: color .2s ease, border .2s ease, background .2s ease;
  }


  .input-container .expand .fa {
    transform: rotate(180deg);
    display: inline-block;
    margin-right: 7px;
    position: relative;
    top: -2px;
  }

  .input-container .expand:hover {
    color: rgba(17, 21, 33, 0.51);
    border-color: rgba(17, 21, 33, 0.51);
    background: rgba(235, 235, 235, 0.3);
  }


  .diagram.flex-options {
    display: flex;
    margin-top: 15px;
    flex-direction: column;
    align-items: stretch;
  }

  .diagram.flex-options > div {
    height: inherit;
    overflow: hidden;
    transition: height .3s ease;
    padding: 10px;
    width: 100%;
  }

  .diagram.flex-options > .diagram-file {
    display: flex;
    align-items: center;
  }

  .diagram.flex-options textarea {
    width: 100%;
  }


  #diagram {
    width: 0;
  }

  #solution-diagram {
    width: 0;
  }

  #diagram-file-label {
    border: 1px solid #111521;
    padding: 10px;
    font-size: 17px;
    color: #111521;
    margin-left: 30px;
    cursor: pointer;
    font-family: "Nunito", sans-serif;
    position: relative;
    z-index: 1;
  }

  #solution-diagram-file-label {
    border: 1px solid #111521;
    padding: 10px;
    font-size: 17px;
    color: #111521;
    margin-left: 30px;
    cursor: pointer;
    font-family: "Nunito", sans-serif;
    position: relative;
    z-index: 1;
  }

  #diagram-file-label .fa {
    margin-right: 10px;
  }

  #solution-diagram-file-label .fa {
    margin-right: 10px;
  }

  #file-name {
    flex: 1;
    margin-left: 15px;
    font-size: 15px;
    color: rgba(17, 21, 33, 0.75);
  }

  #solution-file-name {
    flex: 1;
    margin-left: 15px;
    font-size: 15px;
    color: rgba(17, 21, 33, 0.75);
  }


  #diagram-file-label::before {
    background: #111521;
  }

  #diagram-file-label:hover {
    color: white;
  }


  #solution-diagram-file-label::before {
    background: #111521;
  }

  #solution-diagram-file-label:hover {
    color: white;
  }


  .hint-two.flex-options {
    display: flex;
    margin-top: 15px;
    flex-direction: column;
    align-items: stretch;
  }

  .hint-two.flex-options > input {
    height: inherit;
    overflow: hidden;
    padding: 10px;
    width: 100%;
  }

  .math-input {
    border: 1px solid rgba(40, 46, 91, 0.4);
    border-radius: 5px;
    outline: none;
    padding: 3px 0 3px 12px;
    line-height: 20px;
    transition: box-shadow .3s ease;
    cursor: text;
  }

  .student-answer.flex-options {
    margin: 20px 0 30px 0;
  }

  .flex-options .must-match {
    background: rgba(255, 207, 209, 0.6);
    border-radius: 10px;
    color: #ff6469;
    box-shadow: -0.1px 0 10px rgba(120, 120, 120, 0.5);
    font-size: 11px;
    padding: 20px 35px;
    font-family: "Montserrat", sans-serif;
  }

  .flex-options .algebraically-equivalent {
    background: rgba(40, 83, 128, 0.2);
    border-radius: 10px;
    color: #285380;
    box-shadow: -0.1px 0 10px rgba(120, 120, 120, 0.5);
    font-size: 11px;
    padding: 20px 35px;
    font-family: "Montserrat", sans-serif;
  }

  .flex-options .error-margin {
    display: flex;
    flex-direction: row;
  }

  .flex-options .slider {
    margin-top: 9px;
    width: 100%;
    background: rgba(40, 83, 128, 0.2);
    height: 10px;
    -webkit-appearance: none;
    outline: none;
    border-radius: 15px;
  }

  .flex-options .slider-value {
    width: 85px;
    margin-left: 2.5%;
    padding: 5px;
    font-size: 12px;
    border: 1px solid #285380;
    color: #285380;
    font-family: "Montserrat", sans-serif;
    border-radius: 6px;
    height: 15px;
    text-align: center;
  }

  .flex-options .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #285380;
    cursor: pointer;
  }

  .flex-options .slider::-moz-range-thumb {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #285380;
    cursor: pointer;
  }


  .solution.input-container {
    position: relative;
    z-index: 2;
  }

  .input-container select {
    border: 1px solid rgb(170, 170, 170);
    color: #929292;
    height: 40px;
    outline: none;
    font-family: "Montserrat", sans-serif;
  }

  #topic, #source {
    height: 55px;
    font-size: 17px;
  }

  .other-foci button {
    background: none;
    border: 1px solid #285380;
    border-radius: 15px;
    cursor: pointer;
    padding: 5px 10px;
    color: #285380;
    margin-top: 5px;
    transition: font-weight .2s ease;
  }

  .other-foci button .fa {
    margin-right: 5px;
  }

  .other-foci button:hover {
    font-weight: 900;
  }

  .other-focus {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 10px 15px;
    border-radius: 15px;
    margin: 2px 0 5px 0;
    width: 400px;
    transition: box-shadow .3s ease;
  }

  .other-focus:hover {
    box-shadow: 0 0 10px 0 rgba(100, 100, 100, 0.5);
  }

  .other-focus select {
    height: 30px;
    width: 95%;
    font-size: 12px;
    color: rgb(100, 100, 100);
    border: 1px solid rgb(155, 155, 155);
    outline: none;
  }

  .input-container.source {
    margin-bottom: 20px;
    transition: margin-bottom .3s ease;
  }

  .input-container div.source-other {
    margin-top: 8px;
    height: 180px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
  }

  .input-container div.source-other > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    width: 100%;
  }

  .input-container div.source-other p {
    font-family: "Nunito", sans-serif;
    color: #111521;
    font-weight: 500;
    font-size: 15px;
    position: relative;
    left: 7px;
  }

  .input-container input.source-other, .input-container input.author-other, .input-container select.source-other {
    width: 70%;
  }

  .input-container input.source-other:focus, .input-container input.author-other:focus {
    box-shadow: 0 0 10px 0 rgba(100, 100, 100, 0.5);
    border: 1px solid rgb(170, 170, 170);
    color:rgb(17, 21, 33);
  }

  .input-container div.source-other .fa {
    color: rgb(100, 100, 100);
    position: relative;
    left: 10px;
  }

  #difficulty .fa {
    cursor: pointer;
    padding: 0 3px;
    margin-top: 3px;
    font-size: 22px;
    color: rgb(170, 170, 170);
  }

  #submit {
    margin-left: 25px;
    font-size: 18px;
    width: 92%;
    padding: 15px;
  }

  #submit .fa {
    margin-right: 10px;
    font-size: 16px;
  }


  /* Selector Buttons */
  .input-container .selector-buttons {
    width: 100%;
    height: 37px;
    display: flex;
    align-items: stretch;
    position: relative;
  }

  .selector-buttons button {
    border: 1px solid rgb(155, 155, 155);
    background: transparent;
    color: rgb(155, 155, 155);
    margin: 0;
    position: relative;
    z-index: 2;
    flex: 1;
    outline: none;
    cursor: pointer;
    transition: color .3s ease, background .2s ease;
  }

  .selector-buttons button.active {
    color: white;
  }

  .selector-buttons button:nth-child(2) {
    border-top-left-radius: 18px;
    border-bottom-left-radius: 18px;
  }

  .selector-buttons button:last-child {
    border-top-right-radius: 18px;
    border-bottom-right-radius: 18px;
  }

  .selector-buttons button:hover {
    background: rgba(40, 83, 128, 0.1);
  }

  .input-container .indicator {
    position: absolute;
    width: 33%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    left: 0;
    top: 0;
    transition: left .3s ease;
  }

  .input-container .indicator div {
    background: rgba(40, 83, 128, 0.3);
    position: relative;
    border-radius: 15px;
    width: 120px;
    height: 25px;
  }

  .input-container .selector-buttons.hint-two .indicator, .input-container .selector-buttons.student-answer .indicator {
    width: 50%;
  }

  .input-container .hint-two .indicator div, .input-container .student-answer .indicator div {
    width: 170px;
  }

  .input-container .selector-buttons.calculus .indicator div {
    background: rgba(40, 83, 128, 0.8);
  }



  @media (min-width: 1200px) {
    #problem-submit {
      flex-direction: row;
    }

    #problem-submit .flex {
      width: 50%;
    }

    .full-edit h2 .smaller {
      display: inline;
    }
  }</style>
