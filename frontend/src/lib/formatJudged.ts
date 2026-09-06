export const formatJudge = (str: string): string => {
    if(str[0] == 'A' && str[1] == 'C') return "Accepted";
    if(str == "WA") return "Wrong Answer";
    if(str == "RE") return "Runtime Erorr";
    if(str == "CE") return "Compilation Error";
    return "Time Limit Exceeded";
}