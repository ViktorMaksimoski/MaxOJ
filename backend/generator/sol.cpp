#include <bits/stdc++.h>
#define ar array
//#define int long long
 
using namespace std;
 
using ll = long long;
using pii = pair<int, int>;
using pll = pair<ll, ll>;
 
constexpr int mod = 1e9 + 7;
const ll inf = 1e18;
const int N = 1e5 + 5;
 
signed main() {
    ios_base::sync_with_stdio(false);
    cout.tie(0); cin.tie(0);
     
    int n, d; cin >> n >> d;
    vector<pii> a(n+1);
    for(int i=1; i<=n; i++) cin >> a[i].first >> a[i].second;
    sort(a.begin()+1, a.end());
 
    vector<int> x(n+1), y(n+1);
    for(int i=1; i<=n; i++) {
        x[i] = a[i].first;
        y[i] = a[i].second;
    }
 
 
    int ans = 2e9;
    deque<int> mn, mx;
 
    int j = 1;
    for(int i=1; i<=n; i++) {
        while(!mn.empty() && y[mn.back()] > y[i]) mn.pop_back();
        while(!mx.empty() && y[mx.back()] < y[i]) mx.pop_back();
        mn.push_back(i);
        mx.push_back(i);
 
        while(y[mx.front()] - y[mn.front()] >= d && j < i) {
            ans = min(ans, x[i] - x[j]);
            if(mx.front() == j) mx.pop_front();
            if(mn.front() == j) mn.pop_front();
            j++;
        }
    }
 
    cout << (ans == 2e9 ? -1 : ans) << '\n';
}