tsp.pdf: tspsol.js
	bash runsim.sh
clean:
	rm -f inputdat* outputdat* nearest*.dat sa*.dat *.pdf temp*.dat _a.gnu
