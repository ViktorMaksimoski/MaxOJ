#include <bits/stdc++.h>
using namespace std;
using ll = long long;
using pii = pair<int, int>;
using pll = pair<ll, ll>;
 
const int mod = 1e9 + 7;
const int maxn = 1e6 + 5;
 
signed main() {
    ios_base::sync_with_stdio(false);
    cout.tie(0); cin.tie(0);
 
    int n; cin >> n;
    cout << n / 20 << '\n';
     
    int ans = n / 20;
    if(n % 20 >= 5) ans++;
    cout << ans << '\n';
    return 0;
}