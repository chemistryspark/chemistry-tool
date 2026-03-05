/**
 * Chemistry Spark Lab - Unified Advanced Solver
 * Optimized for: JEE Advanced & GATE (Polytropic + Variable Cv)
 * Location: js/thermodynamics-solver.js
 */

const R = 8.314; // Universal Gas Constant (J/mol·K)

class ChemistrySparkSolver {
    constructor() {
        this.init();
    }

    init() {
        // Link to the "ANALYZE PROCESS" button from your screenshot
        const thermoBtn = document.querySelector('.btn-solve') || document.getElementById('analyze-btn');
        if (thermoBtn) {
            thermoBtn.addEventListener('click', () => this.solveThermodynamics());
        }

        // Link to the "DETERMINE ISOMER COUNT" button
        const isomerBtn = document.getElementById('determine-isomer-btn');
        if (isomerBtn) {
            isomerBtn.addEventListener('click', () => this.solveIsomers());
        }
    }

    // --- 1. THERMODYNAMICS ENGINE (JEE ADVANCED / GATE LEVEL) ---
    solveThermodynamics() {
        try {
            // Mapping inputs from your specific UI screenshot
            const n = parseFloat(document.getElementById('n').value) || 0;
            const T1 = parseFloat(document.getElementById('t1').value) || 0;
            const T2 = parseFloat(document.getElementById('t2').value) || 0;
            const V1 = parseFloat(document.getElementById('v1').value) || 1;
            const V2 = parseFloat(document.getElementById('v2').value) || 1;
            const x = parseFloat(document.getElementById('poly_x').value) || 1.4;
            const cv_a = parseFloat(document.getElementById('cv_a').value) || 12.47;
            const cv_b = parseFloat(document.getElementById('cv_b').value) || 0;

            // POWER FEATURE: Calculus Integration for Variable Cv
            // ΔU = n * ∫(a + bT) dT = n * [a(T2-T1) + 0.5b(T2² - T1²)]
            const deltaU = n * (cv_a * (T2 - T1) + 0.5 * cv_b * (Math.pow(T2, 2) - Math.pow(T1, 2)));

            // POWER FEATURE: Polytropic Work (Handles Isothermal, Adiabatic, and Custom x)
            let work = 0;
            if (Math.abs(x - 1) < 1e-5) {
                // Isothermal Case: W = nRT ln(V2/V1)
                work = n * R * T1 * Math.log(V2 / V1);
            } else {
                // General Polytropic: W = nR(T2 - T1) / (1 - x)
                work = (n * R * (T2 - T1)) / (1 - x);
            }

            // 1st Law (Chemistry Convention): Q = ΔU - W
            const q = deltaU - work;

            this.displayThermoResults(deltaU, work, q);
        } catch (err) {
            console.error("Thermo Solver Error:", err);
        }
    }

    // --- 2. UNIVERSAL ISOMER ENGINE (FIXING THE DECIMAL BUG) ---
    solveIsomers() {
        // Ensuring inputs are treated as Integers to prevent 0.5857... decimals
        const n = parseInt(document.getElementById('chiral_n').value) || 0;
        const m = parseInt(document.getElementById('double_m').value) || 0;
        const sym = document.getElementById('symmetry_type').value;

        let a = 0; // Active
        let meso = 0; // Meso

        // Strict Formula Implementation from your Reference Guide
        if (sym === "unsymmetric") {
            a = Math.pow(2, n);
            meso = 0;
        } else if (sym === "sym_even") {
            a = Math.pow(2, n - 1);
            meso = Math.pow(2, (n / 2) - 1);
        } else if (sym === "sym_odd") {
            // This fix ensures whole numbers for Odd Symmetry
            meso = Math.pow(2, (n - 1) / 2);
            a = Math.pow(2, n - 1) - meso;
        }

        // Apply Geometrical Factor: Total = (a + meso) * 2^m
        const gi_factor = Math.pow(2, m);
        const final_a = a * gi_factor;
        const final_m = meso * gi_factor;

        this.displayIsomerResults(final_a, final_m);
    }

    // --- 3. UI UPDATES ---
    displayThermoResults(du, w, q) {
        // Targets the result IDs from your result-area
        if(document.getElementById('res_u')) document.getElementById('res_u').innerText = `${du.toFixed(2)} J`;
        if(document.getElementById('res_w')) document.getElementById('res_w').innerText = `${w.toFixed(2)} J`;
        if(document.getElementById('res_q')) document.getElementById('res_q').innerText = `${q.toFixed(2)} J`;
        
        const resArea = document.getElementById('result-area');
        if(resArea) resArea.style.display = 'block';
    }

    displayIsomerResults(a, m) {
        if(document.getElementById('out_active')) document.getElementById('out_active').innerText = Math.round(a);
        if(document.getElementById('out_meso')) document.getElementById('out_meso').innerText = Math.round(m);
        if(document.getElementById('out_total')) document.getElementById('out_total').innerText = Math.round(a + m);
    }
}

// Global Initialization
document.addEventListener('DOMContentLoaded', () => {
    window.SolverEngine = new ChemistrySparkSolver();
});
