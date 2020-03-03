import math as math
import random as random

def get_data(n_points = 300, m = 2, b = 7, variance = 5):
    y_train = [(m * x + b + random.uniform(-variance, variance)) for x in range(0, n_points)]
    # x = [(m * x + b) for x in range(0, n_points)]
    x_train = [x for x in range(0, n_points)]
    return [x_train, y_train]

def func(x, theta_vector):
    return (theta_vector[0] * x) + theta_vector[1]

# theta_store = [[1, 1]]
m_store = [[0.0, 0.0]]
v_store = [[0.0, 0.0]]
b1 = 0.9
b2 = 0.99
e = math.pow(10, -8)
alpha = 0.001

# using mse as the loss function:

def gradient_of_mse_loss(y, x, t, theta_store):
    theta_vector = theta_store[t - 1]
    scalar = 2*(y - func(x, theta_vector))
    # print('scalar: ', scalar)
    return [-x * scalar, -1 * scalar]

def gt(t, data, theta_store):
    x_train = data[0]
    y_train = data[1]
    gradient_loss_sum = [0, 0]
    for i in range(1, len(x_train)):
        y = y_train[i]
        x = x_train[i]
        curr_g = gradient_of_mse_loss(y, x, t, theta_store)
        gradient_loss_sum[0] += curr_g[0]
        gradient_loss_sum[1] += curr_g[1]
    return [gradient_loss_sum[0] / len(x_train), gradient_loss_sum[1] / len(x_train)]

def mt(t, data, theta_store):
    old_m = m_store[t - 1]
    temp1 = [b1 * old_m[0], b1 * old_m[1]]
    scale = (1 - b1)
    curr_g = gt(t, data, theta_store)
    temp2 = [scale * curr_g[0], scale * curr_g[1]]
    new_mt = [ temp1[0] + temp2[0], temp1[1] + temp2[1]]
    if len(m_store) <= t:
        m_store.append(new_mt)
    return new_mt

def mtc(t, data, theta_store):
    curr_m = mt(t, data, theta_store)
    denom = 1 - math.pow(b1, t)
    return [curr_m[0] / denom, curr_m[1] / denom]

def vt(t, data, theta_store):
    curr_g = gt(t, data, theta_store)
    curr_g_sq = [math.pow(curr_g[0], 2), math.pow(curr_g[1], 2)]
    temp1 = [b2 * v_store[t - 1][0], b2 * v_store[t - 1][1]]
    scale = (1 - b2)
    temp2 = [scale * curr_g_sq[0], scale * curr_g_sq[1]]
    new_vt = [temp1[0] + temp2[0], temp1[1] + temp2[1]]
    if len(v_store) <= t:
        v_store.append(new_vt)
    return new_vt

def vtc(t, data, theta_store):
    curr_vt = vt(t, data, theta_store)
    denom = 1 - math.pow(b2, t)
    return [curr_vt[0] / denom, curr_vt[1] / denom] 

def theta_t(t, data, theta_store):
    old_theta = theta_store[t - 1]
    m = mtc(t, data, theta_store)
    v = vtc(t, data, theta_store)
    temp1 = [-alpha * m[0], -alpha * m[1]]
    temp2 = [math.pow(v[0], 0.5) + e, math.pow(v[1], 0.5) + e]
    temp3 = [temp1[0] / temp2[0], temp1[1] / temp2[1]]
    new_theta = [old_theta[0] + temp3[0], old_theta[1] + temp3[1]]
    if len(theta_store) <= t:
        theta_store.append(new_theta)
    return new_theta

def adam():
    data = get_data()
    theta_store = [[1, 1]]
    not_converged = True
    old_t = theta_store[0]
    t = 1
    while not_converged:
        theta = theta_t(t, data, theta_store)
        diff = math.pow(old_t[0] - theta[0], 2) + math.pow(old_t[1] - theta[1], 2)
        old_t = theta
        # if diff < 0.0000000000000001:
        if diff < e:
            not_converged = False
        t += 1
    print(theta, t)
    # print('theta_store: ', theta_store)
    # print('m_store: ', m_store)
    # print('v_store: ', v_store)
    return theta

adam()
