import random
import math

# 초기 물건의 무게 설정
items = [2, 3, 4, 5, 5, 6, 7, 8, 10, 11, 13]

num_bins = 2
# bin에 무작위로 초기 설정
bins = [random.randint(0, num_bins - 1) for i in range(len(items))]
print(sum(items))
print(bins)

# 초기 온도와 냉각 비율 설정
temperature = 100.0
cooling_rate = 0.95

def objective_function(items, bins):
    sums = []
    for i in range(num_bins):
        sums.append(sum([item for item, bin_value in zip(items, bins) if bin_value == i]))  
   
    return max(sums) - min(sums)

def annealing(items, bins, temperature, cooling_rate):
    current_solution = bins.copy()
    current_cost = objective_function(items, bins)
    best_bins = bins.copy()
    best_cost = current_cost

    while temperature > 0.01:
        # Randomly select an item to move from one bin to another
        item_to_move = random.randint(0, len(items) - 1)
        bins[item_to_move] = random.randint(0, num_bins - 1)

        new_cost = objective_function(items, bins)
        cost_difference = new_cost - current_cost

        # If the new solution is better or accepted with a certain probability, keep it
        if cost_difference < 0 or random.random() < math.exp(-cost_difference / temperature):
            current_solution = bins.copy()
            current_cost = new_cost
        else:
            # Revert the move
            bins = current_solution
        if new_cost < best_cost:
            best_bins = bins.copy()
            best_cost = new_cost

        # Reduce the temperature
        temperature *= cooling_rate

    return best_bins

# Run simulated annealing
final_bins = annealing(items, bins, temperature, cooling_rate)
print("final_bins:", final_bins)
for i in range(num_bins):
    print("Final Bin %d:"%(i), [item for item, bin_value in zip(items, final_bins) if bin_value == i])
print("Objective Function Value:", objective_function(items, final_bins))
