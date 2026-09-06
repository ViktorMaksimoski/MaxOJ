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
        int n = gen(900, 1000), d = gen(1, 1000);
        
        ofstream in("tests/" + to_string(test) + ".in");
        in << n << " " << d << '\n';

        for(int i=1; i<=n; i++) {
            int x = gen(1, 10000000), y = gen(1, 5000);
            in << x << " " << y << '\n';
        }
    }

    for(int test=3; test<=6; test++) {
        int n = gen((int)5e4, (int)1e5), d = gen(1000, (int)1e6);
        
        ofstream in("tests/" + to_string(test) + ".in");
        in << n << " " << d << '\n';

        for(int i=1; i<=n; i++) {
            int x = gen(1, 10000000), y = gen(1, (int)4e5);
            in << x << " " << y << '\n';
        }
    }

    // for(int test=7; test<=10; test++) {
    //     int n = gen((int)5e5, (int)1e6), d = gen(1000, (int)1e6);
        
    //     ofstream in("tests/" + to_string(test) + ".in");
    //     in << n << " " << d << '\n';

    //     for(int i=1; i<=n; i++) {
    //         int x = gen(1, 10000000), y = gen(1, (int)4e5);
    //         in << x << " " << y << '\n';
    //     }
    // }
}