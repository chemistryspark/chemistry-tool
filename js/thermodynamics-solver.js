/**
 * Chemistry Spark Lab - Advanced Thermodynamics Solver (JEE/GATE Edition)
 * Handles: Real Gases, Variable Cv Integration, Entropy, and Polytropic Work.
 */

const R = 8.314; 

class ThermodynamicsEngine {
    // 1. Van der Waals Real Gas Solver (P = nRT/(V-nb) - an^2/V^2)
    calculateRealGasP(n, V, T, a, b) {
        if (V <= n * b) throw new Error("Volume is less than excluded volume (V < nb)");
        const P = (n * R * T) / (V - n * b) - (a * Math.pow(n, 2) / Math.pow(V, 2));
        return P; // Returns in Pascals
    }

    // 2. Variable Heat Capacity Integration (ΔU = ∫ n * (a + bT) dT)
    calculateDeltaU(n, T1, T2, coeff_a, coeff_b) {
        // Integral of (a + bT) is aT + (b/2)T^2
        const integral = (T) => (coeff_a * T) + (0.5 * coeff_b * Math.pow(T, 2));
        return n * (integral(T2) - integral(T1));
    }

    // 3. Polytropic Work (PV^x = C) - Most common JEE Advanced process
    calculateWork(P1, V1, P2, V2, x) {
        if (Math.abs(x - 1) < 1e-5) {
            return P1 * V1 * Math.log(V2 / V1); // Isothermal case
        }
        return (P2 * V2 - P1 * V1) / (1 - x);
    }

    // 4. Entropy Change (Total) - ΔS = nCv ln(T2/T1) + nR ln(V2/V1)
    calculateEntropy(n, T1, T2, V1, V2, Cv_avg) {
        const dS = (n * Cv_avg * Math.log(T2 / T1)) + (n * R * Math.log(V2 / V1));
        return dS;
    }
}

class ThermodynamicsUI {
    constructor() {
        this.engine = new ThermodynamicsEngine();
        this.init();
    }

    init() {
        document.getElementById('solve-btn').addEventListener('click', () => this.solve());
    }

    solve() {
        try {
            const n = parseFloat(document.getElementById('n').value) || 1;
            const T1 = parseFloat(document.getElementById('T1').value);
            const T2 = parseFloat(document.getElementById('T2').value);
            const V1 = parseFloat(document.getElementById('V1').value) / 1000; // L to m3
            const V2 = parseFloat(document.getElementById('V2').value) / 1000; // L to m3
            const x = parseFloat(document.getElementById('poly_x').value) || 1;
            
            // Advanced Constants
            const a_coeff = parseFloat(document.getElementById('cv_a').value) || 12.47; // Default 1.5R
            const b_coeff = parseFloat(document.getElementById('cv_b').value) || 0;
            
            // Calculation
            const deltaU = this.engine.calculateDeltaU(n, T1, T2, a_coeff, b_coeff);
            
            // Pressure calculation (Ideal vs Real)
            const P1 = (n * R * T1) / V1; 
            const P2 = P1 * Math.pow(V1 / V2, x);
            
            const work = this.engine.calculateWork(P1, V1, P2, V2, x);
            const q = deltaU - work; // 1st Law: Q = ΔU - W (Chemistry Sign Convention)
            const dS = this.engine.calculateEntropy(n, T1, T2, V1, V2, a_coeff);

            this.updateUI(work, deltaU, q, dS, P2);
        } catch (err) {
            alert("Input Error: " + err.message);
        }
    }

    updateUI(w, u, q, s, p2) {
        document.getElementById('res_w').innerHTML = `${w.toFixed(2)} J`;
        document.getElementById('res_u').innerHTML = `${u.toFixed(2)} J`;
        document.getElementById('res_q').innerHTML = `${q.toFixed(2)} J`;
        document.getElementById('res_s').innerHTML = `${s.toFixed(2)} J/K`;
        document.getElementById('res_p2').innerHTML = `${(p2 / 100000).toFixed(3)} bar`;
        
        document.getElementById('result-area').style.display = 'block';
        MathJax.typesetPromise();
    }
}

document.addEventListener('DOMContentLoaded', () => new ThermodynamicsUI());
