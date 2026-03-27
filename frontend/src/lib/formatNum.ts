export const formatNum = (x): string => {
    if(x % 10 == 1) return x + "ва";
    if(x % 10 == 2) return x + "ра";
    return x + "та";
}