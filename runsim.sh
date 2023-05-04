# TSP simulation 

width=1000
height=1000
seedlist=(2021 2022 2023 2024)
#seedlist=(2022)
nodelist=(10 20 30 40 50)

# Step 1: data Generation
for seed in ${seedlist[@]}
do
	for n in ${nodelist[@]}
	do

		echo "Data Generation" $n $seed
		python3 tspgen.py $n $width $height $seed > inputdat.$n.$width.$height.$seed
	done
done

# Step 2: Simulation
for seed in ${seedlist[@]}
do
	for n in ${nodelist[@]}
	do
		echo "Simulation " $n $seed
		node tsptest.js $width $height $seed < inputdat.$n.$width.$height.$seed > outputdat.$n.$width.$height.$seed

	done
done

#Step 3: Data Analysis
echo "Start Analysis"
cat out* | grep nearestfinal | awk '{print $2, $5, $6}' > nearest.dat
cat out* | grep safinal | awk '{print $2, $5, $6}' > sa.dat
python3 tspanalysis.py < sa.dat > saall.dat
python3 tspanalysis.py < nearest.dat > nearestall.dat

cat tsp.gnu | gnuplot

cat tspplot.gnu > _a.gnu
for n in ${nodelist[@]}
do
	for seed in ${seedlist[@]}
	do
		fname=temp.$n.$seed.near.dat
		cat out* | grep plotnear:$n:$seed | grep $seed > $fname
		title=$(cat out* | grep plotneardist:$n:$seed)
		echo "set title \"Nearest $title \"" >> _a.gnu  
		echo "plot \"$fname\" using 2:3 with linespoint ls 5 notitle" >> _a.gnu  
		fname=temp.$n.$seed.sa.dat
		cat out* | grep plotsa:$n:$seed | grep $seed > $fname
		title=$(cat out* | grep plotsadist:$n:$seed)
		echo "set title \"SA $title \"" >> _a.gnu  
		echo "plot \"$fname\" using 2:3 with linespoint ls 6 notitle" >> _a.gnu  
	done
done

cat _a.gnu | gnuplot
ls -l *.pdf

