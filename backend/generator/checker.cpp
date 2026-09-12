#include <bits/stdc++.h>
using namespace std;
using ll = long long;

struct fenwick {
    int n;
    vector<int> tree;

    fenwick(int _n) : n(_n+10), tree(n+10) {}
    
    void update(int p, int v) {
        for(p++; p<n; p+=p&-p) tree[p] += v;
    }

    int query(int p) {
        int ans = 0;
        for(p++; p; p-=p&-p) ans += tree[p];
        return ans;
    }
};

//ACCEPTED - 0
//WRONG ANSWER - 1
//SITE DRUGI GRESKI SE OPFATENI SISTEMSKI
int main(int argc, char **argv) {
    //OVA NE SE CEPKA
    if (argc != 4)
        return 2;

    ifstream input(argv[1]);
    ifstream expected(argv[2]);
    ifstream output(argv[3]);

    if (!input || !output)
        return 2;
    //KRAJ 

    //"-----------ovde kucaj tvoja logika"


    ll n, k;
    input >> n >> k;

    vector<int> a(n+1), vis(n+1);
    for(int i=1; i<=n; i++) {
        int x;
        if(!(output >> x)) return 1;
        a[i] = x;

        if(1 > a[i] || a[i] > n || vis[a[i]]) return 1;

        vis[a[i]] = 1;
    }

    fenwick fwt(n);
    ll cnt = 0;
    for(int i=n; i>=1; i--) {
        cnt += fwt.query(a[i]);
        fwt.update(a[i], 1);
    }

    if(cnt != k) return 1;

    //"-----------"
    
    //I OVA NE SE CEPKA
    string additional;
    if(output >> additional)
        return 1;
    return 0;
}