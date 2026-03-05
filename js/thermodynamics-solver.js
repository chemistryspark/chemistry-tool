/**
 * Chemistry Spark Lab - JEE Advanced / GATE Ultra Engine
 * Logic: First, Second, and Third Laws of Thermodynamics
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
            const n = parseFloat(document.getElementById('n').value) || 0;
            const T1 = parseFloat(document.getElementById('t1').value) || 0;
            const T2 = parseFloat(document.getElementById('t2').value) || 0;
            const V1 = parseFloat(document.getElementById('v1').value) || 1;
            const V2 = parseFloat(document.getElementById('v2').value) || 1;
            const x = parseFloat(document.getElementById('poly_x').value) || 1.4;
            const a = parseFloat(document.getElementById('cv_a').value) || 12.47;
            const b = parseFloat(document.getElementById('cv_b').value) || 0;

            // 1. Internal Energy (ΔU) via calculus integration
            const deltaU = n * (a * (T2 - T1) + 0.5 * b * (Math.pow(T2, 2) - Math.pow(T1, 2)));

            // 2. Work (W) based on Concept Map logic
            let work = 0;
            if (Math.abs(x - 1) < 0.001) { // Isothermal
                work = -2.303 * n * R * T1 * Math.log10(V2 / V1);
            } else { // Polytropic / Adiabatic
                work = (n * R * (T2 - T1)) / (1 - x);
            }

            // 3. Enthalpy (ΔH = ΔU + nRΔT)
            const deltaH = deltaU + (n * R * (T2 - T1));

            // 4. Entropy (ΔS)
            const dS = (2.303 * n * a * Math.log10(T2 / T1)) + (2.303 * n * R * Math.log10(V2 / V1));

            // 5. Gibbs Free Energy (ΔG = ΔH - TΔS)
            const deltaG = deltaH - (T2 * dS);

            this.updateDisplay({
                du: deltaU, dw: work, dh: deltaH, ds: dS, dg: deltaG,
                spont: deltaG < 0 ? "Spontaneous" : "Non-spontaneous"
            });
        } catch (e) { console.error("Error in Calculation", e); }
    }

    updateDisplay(d) {
        document.getElementById('res_u').innerText = d.du.toFixed(2) + " J";
        document.getElementById('res_w').innerText = d.dw.toFixed(2) + " J";
        document.getElementById('res_h').innerText = d.dh.toFixed(2) + " J";
        document.getElementById('res_s').innerText = d.ds.toFixed(3) + " J/K";
        document.getElementById('res_g').innerText = d.dg.toFixed(2) + " J";
        document.getElementById('res_spont').innerText = d.spont;
        document.getElementById('result-area').style.display = 'block';
    }
}
new UltraThermoSolver();
