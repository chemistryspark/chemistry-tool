/**
 * Chemistry Spark Lab - Ultra-High-Power Thermo Engine
 * Logic: Based on First, Second, and Third Laws of Thermodynamics
 */

const R = 8.314; // J/mol·K

class UltraThermoSolver {
    constructor() {
        this.init();
    }

    init() {
        const analyzeBtn = document.getElementById('analyze-btn');
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => this.executeAnalysis());
        }
    }

    executeAnalysis() {
        try {
            // Inputs from your UI
            const n = parseFloat(document.getElementById('n').value) || 0;
            const T1 = parseFloat(document.getElementById('t1').value) || 0;
            const T2 = parseFloat(document.getElementById('t2').value) || 0;
            const V1 = parseFloat(document.getElementById('v1').value) || 1;
            const V2 = parseFloat(document.getElementById('v2').value) || 1;
            const x = parseFloat(document.getElementById('poly_x').value) || 1;
            const a = parseFloat(document.getElementById('cv_a').value) || 0;
            const b = parseFloat(document.getElementById('cv_b').value) || 0;

            // --- ADVANCED CALCULATIONS ---

            // 1. Internal Energy (ΔU) via Calculus Integration
            // Logic: ΔU = ∫ n * (a + bT) dT
            const deltaU = n * (a * (T2 - T1) + 0.5 * b * (Math.pow(T2, 2) - Math.pow(T1, 2)));

            // 2. Work (W) for Polytropic Processes
            // Formula: W = nR(T2 - T1) / (1 - x)
            let work = 0;
            if (Math.abs(x - 1) < 1e-4) {
                // Reversible Isothermal Expansion: W = -2.303nRT log(V2/V1)
                work = -2.303 * n * R * T1 * Math.log10(V2 / V1);
            } else {
                // Reversible Adiabatic Expansion: W = nCv dT = nR(T2 - T1) / (gamma - 1)
                work = (n * R * (T2 - T1)) / (1 - x);
            }

            // 3. Enthalpy (ΔH)
            // Formula: ΔH = ΔU + PΔV = nCp dT
            const Cp = a + R;
            const deltaH = n * (Cp * (T2 - T1) + 0.5 * b * (Math.pow(T2, 2) - Math.pow(T1, 2)));

            // 4. Entropy Change (ΔS)
            // Formula: ΔS = 2.303nCv log(T2/T1) + 2.303nR log(V2/V1)
            const dS = (2.303 * n * a * Math.log10(T2 / T1)) + (2.303 * n * R * Math.log10(V2 / V1));

            // 5. Gibbs Free Energy (ΔG)
            // Formula: ΔG = ΔH - TΔS
            const deltaG = deltaH - (T2 * dS);

            this.updateDisplay({
                du: deltaU,
                dw: work,
                dh: deltaH,
                ds: dS,
                dg: deltaG,
                spontaneity: deltaG < 0 ? "Spontaneous" : "Non-spontaneous"
            });

        } catch (e) {
            console.error("Analysis Failed:", e);
        }
    }

    updateDisplay(data) {
        document.getElementById('res_u').innerText = data.du.toFixed(2) + " J";
        document.getElementById('res_w').innerText = data.dw.toFixed(2) + " J";
        document.getElementById('res_h').innerText = data.dh.toFixed(2) + " J";
        document.getElementById('res_s').innerText = data.ds.toFixed(4) + " J/K";
        document.getElementById('res_g').innerText = data.dg.toFixed(2) + " J";
        document.getElementById('res_spont').innerText = data.spontaneity;
        
        document.getElementById('result-area').style.display = 'block';
    }
}

new UltraThermoSolver();
