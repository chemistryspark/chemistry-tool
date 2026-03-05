/**
 * Thermodynamics Problem Solver - JavaScript Version for GitHub Pages
 * Designed for JEE Advanced and GATE examinations
 * Author: ChemistrySpark
 */

// Physical constants (SI units)
const R = 8.314; // Universal gas constant (J/mol·K)
const R_air = 287.05; // Specific gas constant for air (J/kg·K)
const k_air = 1.4; // Specific heat ratio for air
const cp_air = 1005; // Specific heat at constant pressure for air (J/kg·K)
const cv_air = 718; // Specific heat at constant volume for air (J/kg·K)

// Enums for process and cycle types
const ProcessType = {
 ISOTHERMAL: "isothermal",
 ISOBARIC: "isobaric", 
 ISOCHORIC: "isochoric",
 ADIABATIC: "adiabatic",
 POLYTROPIC: "polytropic"
};

const CycleType = {
 CARNOT: "carnot",
 OTTO: "otto",
 DIESEL: "diesel",
 RANKINE: "rankine"
};

class ThermodynamicState {
 constructor(P = 0, V = 0, T = 0, n = 0, mass = 0) {
 this.P = P;
 this.V = V;
 this.T = T;
 this.n = n;
 this.mass = mass;
 
 // Validate inputs
 if (P < 0) throw new Error("Pressure cannot be negative");
 if (T < 0) throw new Error("Temperature cannot be negative");
 if (V < 0) throw new Error("Volume cannot be negative");
 if (mass < 0) throw new Error("Mass cannot be negative");
 }
}

class ThermodynamicSolver {
 constructor() {
 this.solutions = {};
 }
 
 // Ideal Gas Law: PV = nRT
 solveIdealGas(P, V, n = 0) {
 const T = (P * V) / (n * R);
 return { T, unit: "K" };
 }
 
 // Calculate work for different processes
 calculateWork(process, P1, V1, P2 = null, V2 = null, n = 0, gamma = k_air) {
 let work = 0;
 
 switch(process) {
 case ProcessType.ISOBARIC:
 if (!P2 || !V2) throw new Error("P2 and V2 required for isobaric process");
 work = P1 * (V2 - V1);
 break;
 
 case ProcessType.ISOCHORIC:
 if (V1 !== V2) throw new Error("V1 must equal V2 for isochoric process");
 work = 0;
 break;
 
 case ProcessType.ISOTHERMAL:
 if (!n) n = 1;
 if (!P2 || !V2) throw new Error("P2 and V2 required for isothermal process");
 work = P1 * V1 * Math.log(V2 / V1);
 break;
 
 case ProcessType.ADIABATIC:
 if (!P2 || !V2) throw new Error("P2 and V2 required for adiabatic process");
 work = (P1 * V1 - P2 * V2) / (gamma - 1);
 break;
 
 case ProcessType.POLYTROPIC:
 if (!P2 || !V2) throw new Error("P2 and V2 required for polytropic process");
 work = (P2 * V2 - P1 * V1) / (1 - gamma);
 break;
 }
 
 return { work: Math.abs(work), unit: "J" };
 }
 
 // Carnot cycle analysis
 analyzeCarnotCycle(TH, TC, QH) {
 const efficiency = 1 - (TC / TH);
 const QC = QH * (TC / TH);
 const work = QH - QC;
 
 return {
 efficiency,
 QH,
 QC,
 work,
 COP_refrigerator: TC / (TH - TC),
 COP_heat_pump: TH / (TH - TC)
 };
 }
 
 // Refrigeration cycle analysis
 analyzeRefrigeration(TH, TC) {
 return {
 COP_refrigerator: TC / (TH - TC),
 COP_heat_pump: TH / (TH - TC)
 };
 }
 
 // Gas mixture properties
 analyzeGasMixture(gases) {
 const totalMoles = gases.reduce((sum, gas) => sum + gas.moles, 0);
 
 return {
 totalMoles,
 partialPressures: gases.map(gas => 
 gas.moles * R * gas.T / gas.V
 ),
 cp_mix: gases.reduce((sum, gas) => 
 sum + gas.moles * (gas.cp || 29.1), 0
 ) / totalMoles,
 cv_mix: gases.reduce((sum, gas) => 
 sum + gas.moles * (gas.cv || 20.8), 0
 ) / totalMoles,
 gamma_mix: (gases.reduce((sum, gas) => 
 sum + gas.moles * (gas.cp || 29.1), 0
 ) / totalMoles) / (gases.reduce((sum, gas) => 
 sum + gas.moles * (gas.cv || 20.8), 0
 ) / totalMoles)
 };
 }
}

// UI Controller for GitHub Pages integration
class ThermodynamicsUI {
 constructor() {
 this.solver = new ThermodynamicSolver();
 this.initializeUI();
 }
 
 initializeUI() {
 // Set up event listeners
 this.setupEventListeners();
 // Load saved problems
 this.loadSavedProblems();
 }
 
 setupEventListeners() {
 // Process calculation buttons
 document.getElementById('solve-isothermal').addEventListener('click', () => {
 this.solveIsothermal();
 });
 
 document.getElementById('solve-adiabatic').addEventListener('click', () => {
 this.solveAdiabatic();
 });
 
 document.getElementById('solve-carnot').addEventListener('click', () => {
 this.solveCarnot();
 });
 
 document.getElementById('solve-refrigeration').addEventListener('click', () => {
 this.solveRefrigeration();
 });
 
 // Save/Load functionality
 document.getElementById('save-problem').addEventListener('click', () => {
 this.saveProblem();
 });
 
 document.getElementById('load-problem').addEventListener('click', () => {
 this.loadProblem();
 });
 }
 
 solveIsothermal() {
 try {
 const P1 = parseFloat(document.getElementById('P1').value) * 100000;
 const V1 = parseFloat(document.getElementById('V1').value);
 const V2 = parseFloat(document.getElementById('V2').value);
 const T = parseFloat(document.getElementById('T').value);
 const n = parseFloat(document.getElementById('n').value) || 1;
 
 const P2 = P1 * V1 / V2;
 const work = this.solver.calculateWork(ProcessType.ISOTHERMAL, P1, V1, P2, V2, n, T);
 const heat = work.work; // ΔU = 0 for isothermal
 
 this.displayResult('isothermal-result', {
 finalPressure: P2,
 workDone: work,
 heatAdded: { value: heat, unit: "J" },
 formula: "W = nRT ln(V₂/V₁) = P₁V₁ ln(V₂/V₁)"
 });
 } catch (error) {
 this.displayError('isothermal-result', error.message);
 }
 }
 
 solveAdiabatic() {
 try {
 const P1 = parseFloat(document.getElementById('P1').value) * 100000;
 const V1 = parseFloat(document.getElementById('V1').value);
 const gamma = parseFloat(document.getElementById('gamma').value) || k_air;
 
 const V2 = parseFloat(document.getElementById('V2').value);
 const P2 = P1 * Math.pow(V1 / V2, gamma);
 const work = this.solver.calculateWork(ProcessType.ADIABATIC, P1, V1, P2, V2, 0, gamma);
 
 this.displayResult('adiabatic-result', {
 finalPressure: P2,
 workDone: work,
 formula: "W = (P₁V₁ - P₂V₂)/(γ - 1)"
 });
 } catch (error) {
 this.displayError('adiabatic-result', error.message);
 }
 }
 
 solveCarnot() {
 try {
 const TH = parseFloat(document.getElementById('TH').value);
 const TC = parseFloat(document.getElementById('TC').value);
 const QH = parseFloat(document.getElementById('QH').value) * 1000;
 
 const results = this.solver.analyzeCarnotCycle(TH, TC, QH);
 
 this.displayResult('carnot-result', {
 efficiency: { 
 value: results.efficiency * 100, 
 unit: "%" 
 },
 workOutput: { value: results.work, unit: "J" },
 heatRejected: { value: Math.abs(results.QC), unit: "J" },
 COP_R: { value: results.COP_refrigerator, unit: "dimensionless" },
 COP_HP: { value: results.COP_heat_pump, unit: "dimensionless" },
 formula: "η = 1 - T_C/T_H"
 });
 } catch (error) {
 this.displayError('carnot-result', error.message);
 }
 }
 
 solveRefrigeration() {
 try {
 const TH = parseFloat(document.getElementById('TH').value);
 const TC = parseFloat(document.getElementById('TC').value);
 
 const results = this.solver.analyzeRefrigeration(TH, TC);
 
 this.displayResult('refrigeration-result', {
 COP_refrigerator: { value: results.COP_refrigerator, unit: "dimensionless" },
 COP_heat_pump: { value: results.COP_heat_pump, unit: "dimensionless" },
 formula: "COP_R = T_C/(T_H - T_C)"
 });
 } catch (error) {
 this.displayError('refrigeration-result', error.message);
 }
 }
 
 displayResult(elementId, results) {
 const container = document.getElementById(elementId);
 let html = '<div class="result-box">';
 
 for (const [key, value] of Object.entries(results)) {
 if (typeof value === 'object' && value.value !== undefined) {
 html += `<div class="result-item">
 <span class="label">${key}:</span>
 <span class="value">${value.value.toFixed(4)} ${value.unit || ''}</span>
 </div>`;
 } else if (typeof value === 'string') {
 html += `<div class="result-item formula">
 <span class="formula-label">Formula:</span>
 <span class="formula-value">${value}</span>
 </div>`;
 }
 }
 
 html += '</div>';
 container.innerHTML = html;
 }
 
 displayError(elementId, message) {
 const container = document.getElementById(elementId);
 container.innerHTML = `<div class="error-box">Error: ${message}</div>`;
 }
 
 saveProblem() {
 const problem = {
 type: "thermodynamics",
 timestamp: new Date().toISOString(),
 problem: document.getElementById('problem-input').value,
 solution: this.currentSolution
 };
 
 localStorage.setItem('thermoProblem_' + Date.now(), JSON.stringify(problem));
 alert("Problem saved successfully!");
 }
 
 loadProblems() {
 const problems = JSON.parse(localStorage.getItem('thermoProblems') || '[]');
 // Display list of saved problems
 }
}

// Initialize UI when page loads
document.addEventListener('DOMContentLoaded', () => {
 new ThermodynamicsUI();
});

