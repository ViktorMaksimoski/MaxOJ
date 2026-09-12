#include <bits/stdc++.h>
using namespace std;
using ll = long long;
 
signed main() {
    ll n, k; cin >> n >> k;
    vector<int> ans(n+1);
    for(int i=n-1,c=n; i>=1; i--) {
        if(k >= i) {
            k -= i;
            ans[n-i] = c--;
        }
    }
 
    int c = 1;
    for(int i=1; i<=n; i++)
        cout << (ans[i] ? ans[i] : c++) << " ";
}