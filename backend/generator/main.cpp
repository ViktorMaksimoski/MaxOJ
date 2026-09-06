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
        int x = gen(50, 500);
        
        ofstream in("tests/" + to_string(test) + ".in");
        in << x << '\n';
    }

    ofstream in("tests/3.in");
    in << 9999 << '\n';

    ofstream in2("tests/4.in");
    in2 << 2346 << '\n';

    ofstream in3("tests/5.in");
    in3 << 5376 << '\n';
}