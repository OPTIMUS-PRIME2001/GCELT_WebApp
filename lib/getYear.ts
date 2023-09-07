
function monthDiff(d1: Date, d2: Date) {
    let date1 = new Date(d1);
    let date2 = new Date(d2);
    let yearsDiff = date2.getFullYear() - date1.getFullYear();
    let months =(yearsDiff * 12) + (date2.getMonth() - date1.getMonth()) ;
    return months;
}

const getYear = (dataYear: number) => {
    const JoiningDate = new Date(dataYear, 6);
    const now = new Date();
    let month = monthDiff(JoiningDate, now);
    let Year = String((1 + month/12).toFixed(0)), Sem; 
    if (Year === '2' ) { 
        Year = Year + "nd"; 
         (month>=12 && month<18)? Sem="3rd" : Sem ="4th" ;
    }
    else if (Year === '3') {
         Year = Year + "rd";
         (month>=24 && month<30)? Sem="5th" : Sem ="6th" ; 
    }
    else if (Year === '4') {
         Year = Year + "th";
         (month>=36 && month<42)? Sem="7th" : Sem ="8th" ; 
    }
    else if (Year === '1' ){
        Year = Year + "st";
        (month>=0 && month<6)? Sem="1st" : Sem ="2nd" ;
    }
    else if (parseInt(Year) >= 4){
        Year = "Alumni";
        Sem= "BTech Eng";
    }
    return [Year,Sem] as const;
}
export default getYear;

export function getFirstLettersOfWords(userName: string): string {
    const words = userName.split(' '); // Split the string into words
    const firstLetters = words.map(word => word.charAt(0)); // Get the first character of each word
    return firstLetters.join(''); // Join the first letters back into a string
  }
  