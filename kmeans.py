import random
import math

def get_random_data(n_points = 5, xmin = 0, xmax = 100, ymin = 0, ymax = 100):
    data = []
    x = 0
    y = 0
    for i in range(0, n_points):
        x = random.randrange(xmin, xmax)
        y = random.randrange(ymin, ymax)
        data.append([x,y])
    return data

def get_k_clusers_data(k = 5, spread = 10, n_points = 100):
    data = []
    x = 0
    centroids = get_random_data(k)
    for index in range(0, k):
        cx = centroids[index][0]
        cy = centroids[index][1]
        # data.append([])
        for n in range(0, n_points):
            x = cx + random.randrange(-spread, spread)
            y = cy + random.randrange(-spread, spread)
            # data[index].append([x, y])
            data.append([x, y])
    return data
# check that my data function works
a = get_random_data(10)
print(len(a) == 10)

def distance(a, b):
    xsquared = math.pow(a[0] - b[0], 2)
    ysquared = math.pow(a[1] - b[1], 2)
    return math.sqrt(xsquared + ysquared)
# check that distance funciton works
a = distance([0, 0], [5, 0])
print(a == 5)
a = distance([0, 0], [0, 5])
print(a == 5)
a = distance([0, 0], [5, 5])
print(a == 5 * math.sqrt(2))

def average_coords(data):
    if len(data) == 0:
        return
    x_avg = 0
    y_avg = 0
    for coord in data:
        x_avg += coord[0]
        y_avg += coord[1]
    x_avg = x_avg / len(data)
    y_avg = y_avg / len(data)
    return [x_avg, y_avg]
# check that average_coords works
a = average_coords([[0, 0], [1, 1]])
print(a[0] == 0.5)
print(a[1] == 0.5)

def kmeans(k, data,  xmin = 0, xmax = 100, ymin = 0, ymax = 100):
    k_centroids = []
    buckets = []
    # we start off by making a random guess 
    # for the starting point of each centroid, k_i
    for i in range(0, k):
        x = random.randrange(xmin, xmax)
        y = random.randrange(ymin, ymax)
        k_centroids.append([x, y])
    # we need a variable to keep track of whether or not we should keep iterating
    stop_yet = False
    while stop_yet == False:
        buckets = []
        for i in range(0, k):
            # re-initialize empty buckets for each centroid
            buckets.append([])
        # now we iterate across each data point x_i
        # and determine which centroid it's closest to
        # by determining which centroid as the least distance    
        for i in range(0, len(data)):
            x = data[i]
            # intialize to distance to first centroid k_0
            best_centroid_index = 0
            min_distance = distance(x, k_centroids[best_centroid_index])
            for j in range(0, len(k_centroids)):
                k = k_centroids[j]
                if distance(x, k) < min_distance:
                    min_distance = distance(x, k)
                    best_centroid_index = j
            buckets[best_centroid_index].append(x)
        old_centroids = k_centroids
        # now we take the average x and y values
        # of the data points assigned to each centroid k
        # which is stored in buckets[k]
        for i in range(0, len(buckets)):
            k_centroids[i] = average_coords(buckets[i])
        # now we compare each of the previous centroid coordinates (old_centroids)
        # and check to see if even one of them has changed its position 
        # since we want to stop only when none of the centroids have moved their postions
        #  ^ this is called convergence
        did_anything_change = False
        for i in range(0, len(old_centroids)):
            old = old_centroids[i]
            new = k_centroids[i]
            if old != new:
                did_anything_change = True
        # if any of the centroids have moved locations
        # then we need to keep iterating
        if did_anything_change:
            stop_yet = False
        else:
            stop_yet = True
    return k_centroids

test_data_1 = [[1,1], [0,0], [1,1], [0,0]]
result = kmeans(1, test_data_1)
print(result)
result = kmeans(2, test_data_1)
print(result)
result = kmeans(2, test_data_1)
print(result)

print ('test random_data: ')
test_data_1 = get_random_data(100)
result = kmeans(2, test_data_1)
print(result)
result = kmeans(3, test_data_1)

print('test k_clusers_data:')
test_data_2 = get_k_clusers_data(5)
result = kmeans(2, test_data_2)
print(result)
result = kmeans(3, test_data_2)
print(result)

# test with coordiantes along perimeter of circle 
# using one centroid, it should give us the center point of the circle
center_x = 0
center_y = 0
pi = math.pi
delta_rad = (2*pi/8)
radius = 5
circle_data = []
for i in range(0, 8):
   x = center_x + radius * math.cos(i * delta_rad)
   y = center_y + radius * math.sin(i * delta_rad)
   circle_data.append([x,y])

result = kmeans(1, circle_data)
print(result)

# test with coordiantes along perimeter of circle 
# using one centroid, it should give us the center point of the circle
center_x = 4
center_y = 4
pi = math.pi
delta_rad = (2 * (pi/8))
radius = 5
circle_data = []
for i in range(0, 8):
   x = center_x + radius * math.cos(i * delta_rad)
   y = center_y + radius * math.sin(i * delta_rad)
   circle_data.append([x,y])

result = kmeans(1, circle_data)
print(result)