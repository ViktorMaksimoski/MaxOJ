#include <bits/stdc++.h>
using namespace std;
using ll = long long;
using pii = pair<int, int>;
using pll = pair<ll, ll>;

const int mod = 1e9 + 7;
const int N = 2e5 + 5;
const ll inf = 1e18;

mt19937 rng(chrono::steady_clock::now().time_since_epoch().count());

ll gen(ll l, ll r) {
    return uniform_int_distribution<ll>(l, r)(rng);
}

signed main() {
    ios_base::sync_with_stdio(false);
    cin.tie(0); cout.tie(0);

    for(int test=1; test<=2; test++) {
        ll n = gen(100, 200), d = gen(0, (ll)n*(n-1)/2);
        
        ofstream in("tests/" + to_string(test) + ".in");
        in << n << " " << d << '\n';
    }

    for(int test=3; test<=5; test++) {
        ll n = gen(1e5, 1e6), d = gen(0, (ll)n*(n-1)/2);

        ofstream in("tests/" + to_string(test) + ".in");
        in << n << " " << d << '\n';
    }

    {
        ll n = 1000, k = 30;
        ofstream in("tests/6.in");
        in << n << " " << k << '\n';
    }
}