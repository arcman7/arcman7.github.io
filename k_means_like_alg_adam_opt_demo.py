import random
import math
import numpy as np

# a = np.array([10,20,30,40,50])
# b = np.array([5, 10, 15, 20, 25])

# get_gradient must be a function that
# returns a vector whos length matches theta
# the function must take as arguments the
# parameters theta and data (the dataset)
class Adam:
    def __init__(self, theta, data, get_gradient, max_iterations = (10 ** 6)):
        self.get_gradient = get_gradient
        self.theta = np.array(theta)
        self.theta_store = [self.theta]
        self.data = np.array(data)
        self.v_store = [self.get_zero_matrix(1, len(self.theta))]
        self.m_store = [self.get_zero_matrix(1, len(self.theta))]
        self.g_store = [self.get_zero_matrix(1, len(self.theta))]
        self.b1 = 0.9
        self.b2 = 0.999
        self.e = 10**(-8)
        self.a = 0.001
        self.max_iterations = max_iterations
        self.t = 1
    def start(self):
        keep_going = True
        while keep_going:
            theta = self.get_theta(self.t)
            self.t += 1
            if np.square(theta - self.theta_store[self.t - 1]).sum() < (self.e ** 2):
                keep_going = False
            if self.t >= self.max_iterations:
                keep_going = False
        return theta
    def get_theta(self, t):
        if len(self.theta_store) <= t:
            curr_t = self.theta_store[t - 1] - (self.a * self.get_m_adj(t)) / ((self.get_v_adj(t) ** 0.5) + self.e)
            self.theta_store.append(curr_t)
            print ('get_theta: ---------------------------')
            print(curr_t)
        return self.theta_store[t]
    def get_g(self, t):
        if len(self.g_store) <= t:
            curr_g = self.get_gradient(self.theta_store[t - 1], self.data)
            print ('get_g: ---------------------------')
            print(curr_g)
            self.g_store.append(curr_g)
        return self.g_store[t]
    def get_m(self, t):
        if len(self.m_store) <= t:
            curr_m = (self.b1 * self.m_store[t - 1]) + ((1 - self.b1) * self.get_g(t))
            self.m_store.append(curr_m)
        return self.m_store[t]
    def get_v(self, t):
        if len(self.v_store) <= t:
            curr_v = (self.b2 * self.v_store[t - 1]) + ((1 - self.b2) * np.square(self.get_g(t)))
            self.v_store.append(curr_v)
        return self.v_store[t]
    def get_m_adj(self, t):
        return self.get_m(t) / (1 - (self.b1**t))
    def get_v_adj(self, t):
        return self.get_v(t) / (1 - (self.b2**t))
    def get_zero_matrix(self, n, m):
        return np.zeros((m, n, len(self.data[0])))


def get_random_data(n_points = 5, xmin = 0, xmax = 100, ymin = 0, ymax = 100):
    data = []
    x = 0
    y = 0
    for i in range(0, n_points):
        x = random.randrange(xmin, xmax)
        y = random.randrange(ymin, ymax)
        data.append([x,y])
    return data

def get_n_random_samples(data, n):
    return random.sample(data, n)

def get_k_clusers_data(k = 5, spread = 10, n_points = 100):
    data = []
    x = 0
    centroids = get_random_data(k)
    for index in range(0, k):
        cx = centroids[index][0]
        cy = centroids[index][1]
        for n in range(0, n_points):
            x = cx + random.randrange(-spread, spread)
            y = cy + random.randrange(-spread, spread)
            data.append([x, y])
    return data
    
# theta is the full parameter_vector minus the current value of theta
# theta is of lenght paramter_vector - 1
def gradient_diag(data, theta, row, column):
    theta_val = theta[row]
    print('gradient_diag ************************')
    print('theta: ', theta, ' type: ', type(theta))
    # print('data: ', data, ' type: ', type(data))
    # print('data: ', theta_val, ' type: ', type(theta_val))
    err = (data - theta_val)
    err_sum = 2 * (err.sum())
    theta_diff_sqd = np.square(theta_val - theta)
    theta
    theta_diff_sum = (1.0 / theta_diff_sqd).sum()
    err_sqd = np.square(err)
    theta_diff_cube = theta_diff_sqd * (theta_val - theta)
    return -(err_sum * theta_diff_sum) + (-2 * (err_sqd.sum() * ((1.0 / theta_diff_cube).sum())))

def gradient_off_diag(data, theta, row, column):
    print('gradient_off_diag $$$$$$$$$$$$$$$$$$$$$$$$')
    print('theta: ', theta, ' type: ', type(theta))
    theta_val = theta[row]
    err = (data - theta_val)
    theta_diff = theta_val - theta[column]
    theta_diff_cube = theta_diff * np.square(theta_diff)
    return 2 * (np.square(err).sum()) * (1.0 / theta_diff_cube)

def get_zero_matrix(n, m, d):
    return np.zeros((m, n, d))

def get_gradient(theta, data):
    print('get_gradient @@@@@@@@@@@@@@@@@@@@@@@@')
    print('theta: ', theta, ' type: ', type(theta))
    gradient_matrix_form = np.array(get_zero_matrix(len(theta), len(theta), len(data[0])))
    for i in range(0, len(theta)):
        for j in range(0, len(theta)):
            if i == j:
                gradient_matrix_form[i][j] = gradient_diag(data, theta, i, j)
            else:
                gradient_matrix_form[i][j] = gradient_off_diag(data, theta, i, j)
    val = gradient_matrix_form.sum(axis=0)
    print('val')
    print(val)
    return val

def my_k_means(k, data):
    k_centroids = get_n_random_samples(data, k)
    adam = Adam(k_centroids, data, get_gradient)
    best_centroids = adam.start()
    print(best_centroids)
my_k_means(5, get_k_clusers_data())
