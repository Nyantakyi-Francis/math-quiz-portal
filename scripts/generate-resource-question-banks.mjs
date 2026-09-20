import { writeFileSync } from "node:fs";
import { join } from "node:path";

const topics = [
  {
    id: "fractions-percentages",
    title: "Fractions & Percentages",
    module: 12,
    description: "Practice on fraction operations, percentage change, discounts, profit, and comparison.",
    questions: [
      q("Simplify $\\frac{18}{24}$.", ["$\\frac{3}{4}$", "$\\frac{2}{3}$", "$\\frac{4}{3}$", "$\\frac{6}{8}$"], 0, "Divide numerator and denominator by $6$: $18/24=3/4$."),
      q("Evaluate $\\frac{2}{3}+\\frac{1}{6}$.", ["$\\frac{1}{2}$", "$\\frac{5}{6}$", "$\\frac{3}{9}$", "$\\frac{2}{9}$"], 1, "Use denominator $6$: $2/3=4/6$, so $4/6+1/6=5/6$."),
      q("Evaluate $\\frac{5}{8}-\\frac{1}{4}$.", ["$\\frac{3}{8}$", "$\\frac{4}{4}$", "$\\frac{1}{8}$", "$\\frac{1}{2}$"], 0, "$1/4=2/8$, so $5/8-2/8=3/8$."),
      q("Find $\\frac{3}{5}$ of $45$.", ["$15$", "$18$", "$27$", "$30$"], 2, "$3/5$ of $45$ is $(3/5)\\times45=27$."),
      q("Evaluate $2\\frac{1}{3}+1\\frac{1}{6}$.", ["$3\\frac{1}{2}$", "$3\\frac{1}{3}$", "$4\\frac{1}{6}$", "$2\\frac{1}{2}$"], 0, "$2\\frac13=14/6$ and $1\\frac16=7/6$. Their sum is $21/6=3\\frac12$."),
      q("Which is greater: $\\frac{3}{4}$ or $\\frac{5}{8}$?", ["$\\frac{5}{8}$", "$\\frac{3}{4}$", "They are equal", "Cannot be compared"], 1, "$3/4=6/8$, and $6/8>5/8$."),
      q("Convert $0.35$ to a fraction in its simplest form.", ["$\\frac{7}{20}$", "$\\frac{35}{10}$", "$\\frac{3}{5}$", "$\\frac{5}{7}$"], 0, "$0.35=35/100=7/20$."),
      q("Convert $\\frac{7}{20}$ to a percentage.", ["$20\\%$", "$28\\%$", "$35\\%$", "$70\\%$"], 2, "$7/20=0.35=35\\%$."),
      q("Find $15\\%$ of $240$.", ["$24$", "$30$", "$36$", "$42$"], 2, "$15\\%$ of $240$ is $0.15\\times240=36$."),
      q("Increase $80$ by $25\\%$.", ["$95$", "$100$", "$105$", "$120$"], 1, "$25\\%$ of $80$ is $20$, so the increased value is $100$."),
      q("Decrease $150$ by $20\\%$.", ["$120$", "$130$", "$140$", "$100$"], 0, "$20\\%$ of $150$ is $30$, so $150-30=120$."),
      q("A shirt costs GHS $120$ after a $25\\%$ discount. What was the original price?", ["GHS $140$", "GHS $150$", "GHS $160$", "GHS $180$"], 2, "After a $25\\%$ discount, the price is $75\\%$ of the original. $120/0.75=160$."),
      q("A trader buys an item for GHS $80$ and sells it for GHS $100$. Find the percentage profit.", ["$20\\%$", "$25\\%$", "$30\\%$", "$80\\%$"], 1, "Profit is $20$. Percentage profit is $20/80\\times100\\%=25\\%$."),
      q("A price rises from GHS $50$ to GHS $65$. Find the percentage increase.", ["$15\\%$", "$23\\%$", "$30\\%$", "$35\\%$"], 2, "Increase is $15$. $15/50\\times100\\%=30\\%$."),
      q("Express $\\frac{5}{8}$ as a decimal.", ["$0.58$", "$0.625$", "$0.675$", "$0.75$"], 1, "$5\\div8=0.625$."),
      q("Evaluate $\\frac{4}{9}\\div\\frac{2}{3}$.", ["$\\frac{2}{3}$", "$\\frac{8}{27}$", "$\\frac{3}{2}$", "$\\frac{6}{13}$"], 0, "Divide by multiplying by the reciprocal: $4/9\\times3/2=12/18=2/3$."),
      q("Evaluate $\\frac{7}{10}\\times\\frac{5}{14}$.", ["$\\frac{1}{2}$", "$\\frac{1}{4}$", "$\\frac{35}{140}$", "$\\frac{7}{28}$"], 1, "$7/10\\times5/14=35/140=1/4$."),
      q("What percentage of $80$ is $12$?", ["$12\\%$", "$15\\%$", "$18\\%$", "$20\\%$"], 1, "$12/80\\times100\\%=15\\%$."),
      q("A class has $18$ boys and $12$ girls. What fraction of the class are girls?", ["$\\frac{2}{5}$", "$\\frac{3}{5}$", "$\\frac{12}{18}$", "$\\frac{5}{2}$"], 0, "There are $30$ learners. The fraction of girls is $12/30=2/5$."),
      q("Share GHS $84$ in the ratio $3:4$. What is the larger share?", ["GHS $36$", "GHS $42$", "GHS $48$", "GHS $54$"], 2, "There are $7$ parts. One part is $84/7=12$, so the larger share is $4\\times12=48$."),
      q("A fraction equals $\\frac{3}{5}$. If its denominator is $35$, find its numerator.", ["$15$", "$18$", "$21$", "$25$"], 2, "$5$ is multiplied by $7$ to get $35$, so $3$ is also multiplied by $7$ to get $21$."),
      q("Find the value of $\\frac{2}{5}$ as a percentage.", ["$20\\%$", "$25\\%$", "$40\\%$", "$50\\%$"], 2, "$2/5=0.4=40\\%$."),
      q("A student scored $36$ out of $45$. Express the score as a percentage.", ["$75\\%$", "$80\\%$", "$85\\%$", "$90\\%$"], 1, "$36/45\\times100\\%=80\\%$."),
      q("Find $125\\%$ of $64$.", ["$72$", "$76$", "$80$", "$96$"], 2, "$125\\%=1.25$, and $1.25\\times64=80$."),
      q("If $40\\%$ of a number is $28$, find the number.", ["$56$", "$64$", "$70$", "$84$"], 2, "Let the number be $x$. $0.4x=28$, so $x=70$."),
      q("A value changes from $200$ to $170$. Find the percentage decrease.", ["$10\\%$", "$15\\%$", "$20\\%$", "$30\\%$"], 1, "Decrease is $30$. $30/200\\times100\\%=15\\%$."),
      q("Simplify $\\frac{3}{7}+\\frac{2}{21}$.", ["$\\frac{5}{28}$", "$\\frac{11}{21}$", "$\\frac{5}{21}$", "$\\frac{1}{3}$"], 1, "$3/7=9/21$, so $9/21+2/21=11/21$."),
      q("Evaluate $3-\\frac{5}{6}$.", ["$2\\frac{1}{6}$", "$2\\frac{5}{6}$", "$3\\frac{5}{6}$", "$1\\frac{1}{6}$"], 0, "$3=18/6$, so $18/6-5/6=13/6=2\\frac16$."),
      q("Which fraction is equivalent to $0.125$?", ["$\\frac{1}{4}$", "$\\frac{1}{8}$", "$\\frac{1}{5}$", "$\\frac{3}{8}$"], 1, "$0.125=125/1000=1/8$."),
      q("A phone is sold for GHS $900$ at a loss of $10\\%$. Find the cost price.", ["GHS $810$", "GHS $990$", "GHS $1000$", "GHS $1100$"], 2, "Selling price is $90\\%$ of cost price. $900/0.9=1000$."),
      q("A quantity is increased by $10\\%$ and then decreased by $10\\%$. What is the final percentage change?", ["No change", "$1\\%$ decrease", "$1\\%$ increase", "$10\\%$ decrease"], 1, "Using $100$ as the original value: $100\\to110\\to99$, so the final value is $1\\%$ lower."),
      q("Find $\\frac{3}{4}$ of $\\frac{2}{9}$.", ["$\\frac{1}{6}$", "$\\frac{5}{13}$", "$\\frac{3}{18}$", "$\\frac{2}{3}$"], 0, "$3/4\\times2/9=6/36=1/6$."),
      q("Write $4:5$ as a fraction of the whole represented by the first part.", ["$\\frac{4}{5}$", "$\\frac{4}{9}$", "$\\frac{5}{9}$", "$\\frac{9}{4}$"], 1, "The total number of parts is $4+5=9$, so the first part is $4/9$ of the whole."),
      q("If $\\frac{x}{12}=\\frac{5}{6}$, find $x$.", ["$8$", "$10$", "$12$", "$15$"], 1, "$x=12\\times5/6=10$."),
      q("A bank pays $8\\%$ simple interest on GHS $500$ for one year. Find the interest.", ["GHS $20$", "GHS $30$", "GHS $40$", "GHS $80$"], 2, "Interest is $8/100\\times500=40$."),
      q("Convert $72\\%$ to a fraction in simplest form.", ["$\\frac{18}{25}$", "$\\frac{36}{50}$", "$\\frac{72}{10}$", "$\\frac{7}{2}$"], 0, "$72\\%=72/100=18/25$."),
      q("What is $\\frac{1}{3}$ of $60\\%$?", ["$10\\%$", "$15\\%$", "$20\\%$", "$30\\%$"], 2, "$60\\%/3=20\\%$."),
      q("Order these fractions from smallest to largest: $\\frac{1}{2},\\frac{2}{3},\\frac{3}{5}$.", ["$\\frac12,\\frac35,\\frac23$", "$\\frac23,\\frac35,\\frac12$", "$\\frac35,\\frac12,\\frac23$", "$\\frac12,\\frac23,\\frac35$"], 0, "Using decimals: $1/2=0.5$, $3/5=0.6$, and $2/3\\approx0.667$."),
      q("A discount of $15\\%$ is given on GHS $240$. Find the discount.", ["GHS $24$", "GHS $30$", "GHS $36$", "GHS $40$"], 2, "$15\\%$ of $240$ is $0.15\\times240=36$."),
      q("A mixture contains $2\\frac12$ litres of water and $1\\frac34$ litres of juice. Find the total volume.", ["$3\\frac14$ litres", "$4\\frac14$ litres", "$4\\frac12$ litres", "$5\\frac14$ litres"], 1, "$2\\frac12+1\\frac34=2\\frac24+1\\frac34=3\\frac54=4\\frac14$."),
    ]
  },
  buildNumberSets(),
  buildAlgebra(),
  buildLinear(),
  buildAngles(),
  buildMeasurement(),
  buildIndependentProbability(),
  buildDataOrganisation()
];

function q(prompt, options, correct, explanation) {
  return { q: prompt, options, correct, explanation };
}

function buildNumberSets() {
  const questions = [
    q("Which of the following is a natural number?", ["$0$", "$-3$", "$\\frac12$", "$7$"], 3, "Natural numbers are positive counting numbers, so $7$ is natural."),
    q("Which set contains only integers?", ["$\\{-2,0,5\\}$", "$\\{1.5,2,3\\}$", "$\\{\\sqrt2,4,6\\}$", "$\\{\\frac12,1,2\\}$"], 0, "Integers include negative whole numbers, zero, and positive whole numbers."),
    q("Which number is irrational?", ["$0.25$", "$\\sqrt{2}$", "$-7$", "$\\frac{3}{8}$"], 1, "$\\sqrt2$ cannot be written as a ratio of two integers."),
    q("Write $A=\\{1,2,3,4\\}$ and $B=\\{3,4,5\\}$. Find $A\\cap B$.", ["$\\{1,2,5\\}$", "$\\{3,4\\}$", "$\\{1,2,3,4,5\\}$", "$\\{5\\}$"], 1, "The intersection contains elements common to both sets: $3$ and $4$."),
    q("For $A=\\{a,b,c\\}$ and $B=\\{c,d\\}$, find $A\\cup B$.", ["$\\{c\\}$", "$\\{a,b,d\\}$", "$\\{a,b,c,d\\}$", "$\\{a,b,c,c,d\\}$"], 2, "The union lists all distinct elements in either set."),
    q("If $U=\\{1,2,3,4,5\\}$ and $A=\\{2,4\\}$, find $A'$.", ["$\\{1,3,5\\}$", "$\\{2,4\\}$", "$\\{1,2,3,4,5\\}$", "$\\{5\\}$"], 0, "The complement of $A$ contains elements of $U$ not in $A$."),
    q("Which statement is true?", ["$3\\in\\{1,2,4\\}$", "$5\\notin\\{2,4,6\\}$", "$0\\in\\{1,2,3\\}$", "$7\\notin\\{7,8\\}$"], 1, "$5$ is not a member of $\\{2,4,6\\}$, so the statement is true."),
    q("How many subsets does a set with $4$ elements have?", ["$4$", "$8$", "$12$", "$16$"], 3, "A set with $n$ elements has $2^n$ subsets. Here $2^4=16$."),
    q("How many proper subsets does a set with $3$ elements have?", ["$6$", "$7$", "$8$", "$9$"], 1, "There are $2^3=8$ subsets. Excluding the set itself leaves $7$ proper subsets."),
    q("Which of the following is an empty set?", ["Set of even prime numbers", "Set of months with 32 days", "Set of factors of 1", "Set of vowels in 'cat'"], 1, "No month has $32$ days, so that set has no elements."),
  ];
  const classes = [
    ["$-5$", "integer", "$-5$ is a negative whole number, so it is an integer."],
    ["$0$", "whole number", "$0$ belongs to the whole numbers."],
    ["$\\frac{9}{3}$", "integer", "$9/3=3$, which is an integer."],
    ["$\\pi$", "irrational number", "$\\pi$ is non-terminating and non-repeating."],
    ["$0.\\overline{6}$", "rational number", "A recurring decimal can be written as a fraction."],
    ["$\\sqrt{49}$", "natural number", "$\\sqrt{49}=7$, a positive counting number."],
  ];
  for (const [value, answer, expl] of classes) {
    const options =
      answer === "whole number"
        ? ["natural number", "whole number", "integer", "irrational number"]
        : ["natural number", "integer", "rational number", "irrational number"];
    questions.push(q(`Classify ${value}.`, options, options.indexOf(answer), expl));
  }
  questions.push(
    q("If $n(A)=12$, $n(B)=9$, and $n(A\\cap B)=4$, find $n(A\\cup B)$.", ["$17$", "$21$", "$25$", "$5$"], 0, "$n(A\\cup B)=n(A)+n(B)-n(A\\cap B)=12+9-4=17$."),
    q("If $A\\subset B$, which statement is always true?", ["Every element of $A$ is in $B$.", "Every element of $B$ is in $A$.", "$A$ and $B$ have no common element.", "$A$ is empty."], 0, "$A\\subset B$ means every element of $A$ belongs to $B$."),
    q("Which notation means '$x$ is not an element of $A$'?", ["$x\\in A$", "$x\\notin A$", "$x\\subset A$", "$x\\cup A$"], 1, "$\\notin$ means 'is not an element of'."),
    q("Find the cardinality of $\\{2,4,6,8,10\\}$.", ["$2$", "$4$", "$5$", "$10$"], 2, "Cardinality is the number of elements. This set has $5$ elements."),
    q("Which set is finite?", ["Set of counting numbers", "Set of integers", "Set of multiples of 5", "Set of factors of 24"], 3, "The factors of $24$ can be listed completely, so the set is finite."),
    q("Which set is infinite?", ["Set of prime factors of 30", "Set of vowels in English", "Set of multiples of 3", "Set of days in a week"], 2, "Multiples of $3$ continue without end."),
    q("Find $A-B$ if $A=\\{1,2,3,4\\}$ and $B=\\{3,4,5\\}$.", ["$\\{1,2\\}$", "$\\{3,4\\}$", "$\\{5\\}$", "$\\{1,2,5\\}$"], 0, "$A-B$ means elements in $A$ that are not in $B$."),
    q("Which of these is a singleton set?", ["$\\{1,2\\}$", "$\\{0\\}$", "$\\{\\}$", "$\\{a,b,c\\}$"], 1, "A singleton set has exactly one element."),
    q("If $A=\\{x:x$ is a factor of $6\\}$, which set represents $A$?", ["$\\{1,2,3,6\\}$", "$\\{2,3,4,5\\}$", "$\\{6,12,18\\}$", "$\\{0,1,2,3\\}$"], 0, "The positive factors of $6$ are $1,2,3,$ and $6$."),
    q("Which is the set of prime numbers less than $10$?", ["$\\{1,2,3,5,7\\}$", "$\\{2,3,5,7\\}$", "$\\{2,4,6,8\\}$", "$\\{3,5,7,9\\}$"], 1, "$1$ is not prime, and the primes less than $10$ are $2,3,5,7$."),
    q("Find $A\\cap B$ if $A$ is the set of even numbers less than $10$ and $B$ is the set of multiples of $3$ less than $10$.", ["$\\{6\\}$", "$\\{2,4,8\\}$", "$\\{3,6,9\\}$", "$\\{2,3,4,6,8,9\\}$"], 0, "Even numbers less than $10$ are $2,4,6,8$; multiples of $3$ are $3,6,9$. The common element is $6$."),
    q("Which statement correctly describes disjoint sets?", ["They have equal elements.", "They have no common element.", "One is a subset of the other.", "Their union is empty."], 1, "Disjoint sets have an empty intersection."),
    q("If $A\\cap B=\\varnothing$, then $A$ and $B$ are:", ["equal sets", "disjoint sets", "universal sets", "infinite sets"], 1, "An empty intersection means the sets are disjoint."),
    q("Which symbol represents the empty set?", ["$\\in$", "$\\subset$", "$\\varnothing$", "$\\cup$"], 2, "$\\varnothing$ denotes the empty set."),
    q("Which of the following is a rational number?", ["$\\sqrt3$", "$\\pi$", "$-\\frac{4}{7}$", "$\\sqrt5$"], 2, "$-4/7$ is a ratio of two integers."),
    q("Find $n(A')$ if $n(U)=30$ and $n(A)=18$.", ["$12$", "$18$", "$30$", "$48$"], 0, "$n(A')=n(U)-n(A)=30-18=12$."),
    q("Which set is equal to $\\{3,1,2\\}$?", ["$\\{1,2,3\\}$", "$\\{1,2\\}$", "$\\{3,3,1,2\\}$", "$\\{1,2,4\\}$"], 0, "Order does not matter in a set; the elements are $1,2,3$."),
    q("If $A=\\{1,2\\}$ and $B=\\{1,2,3\\}$, what is the relation between $A$ and $B$?", ["$A\\subset B$", "$B\\subset A$", "$A\\cap B=\\varnothing$", "$A=B$"], 0, "Every element of $A$ is also in $B$."),
    q("The universal set is usually the set that contains:", ["only empty elements", "all elements under discussion", "only common elements", "only natural numbers"], 1, "The universal set contains all elements being considered in the problem."),
    q("Which number belongs to $\\mathbb{Z}$ but not to $\\mathbb{N}$?", ["$5$", "$-2$", "$\\frac12$", "$\\sqrt2$"], 1, "$-2$ is an integer but not a natural counting number."),
    q("Which is true for $A=\\{2,4,6\\}$?", ["$4\\subset A$", "$4\\in A$", "$A\\in4$", "$A\\notin 6$"], 1, "$4$ is an element of $A$, so $4\\in A$."),
    q("How many elements are in $\\{x:x$ is a letter in the word LEVEL$\\}$?", ["$3$", "$4$", "$5$", "$2$"], 0, "The distinct letters are L, E, and V, so there are $3$ elements."),
    q("Which expression gives the number of elements in exactly one of two sets?", ["$n(A)+n(B)+n(A\\cap B)$", "$n(A\\cup B)-n(A\\cap B)$", "$n(A\\cap B)$", "$n(A)-n(B)$"], 1, "Elements in exactly one set are the union excluding the intersection, so use $n(A\\cup B)-n(A\\cap B)$."),
    q("If $A=\\{1,3,5,7\\}$ and $B=\\{2,3,5,8\\}$, find $(A\\cup B)-(A\\cap B)$.", ["$\\{1,2,7,8\\}$", "$\\{3,5\\}$", "$\\{1,2,3,5,7,8\\}$", "$\\{1,7\\}$"], 0, "The union is $\\{1,2,3,5,7,8\\}$ and the intersection is $\\{3,5\\}$, leaving $\\{1,2,7,8\\}$.")
  );
  return bank("number-sets", "Number Sets", 13, "Classification of numbers, set notation, membership, subsets, complements, and Venn reasoning.", questions);
}

function buildAlgebra() {
  const questions = [
    q("Simplify $3x+5x-2x$.", ["$6x$", "$8x$", "$10x$", "$6x^2$"], 0, "Combine like terms: $3x+5x-2x=6x$."),
    q("Expand $4(x+3)$.", ["$4x+3$", "$x+12$", "$4x+12$", "$7x$"], 2, "Multiply each term in the bracket by $4$: $4x+12$."),
    q("Expand $(x+5)(x+2)$.", ["$x^2+7x+10$", "$x^2+10x+7$", "$x^2+3x+10$", "$2x+7$"], 0, "$x^2+2x+5x+10=x^2+7x+10$."),
    q("Factorise $6x+9$.", ["$3(2x+3)$", "$6(x+9)$", "$9(x+6)$", "$3(6x+9)$"], 0, "The highest common factor is $3$, so $6x+9=3(2x+3)$."),
    q("Factorise $x^2-9$.", ["$(x-9)(x+1)$", "$(x-3)^2$", "$(x-3)(x+3)$", "$(x+9)(x-1)$"], 2, "$x^2-9$ is a difference of two squares: $(x-3)(x+3)$."),
  ];
  const more = [
    ["Simplify $2a+3b-a+5b$.", ["$a+8b$", "$3a+8b$", "$a+2b$", "$2a+8b$"], 0, "Collect like terms: $2a-a=a$ and $3b+5b=8b$."],
    ["Expand $-3(2x-5)$.", ["$-6x+15$", "$-6x-15$", "$6x+15$", "$-x+2$"], 0, "Multiply both terms by $-3$: $-6x+15$."],
    ["Factorise $x^2+5x+6$.", ["$(x+1)(x+6)$", "$(x+2)(x+3)$", "$(x-2)(x-3)$", "$(x+5)(x+1)$"], 1, "Find two numbers that multiply to $6$ and add to $5$: $2$ and $3$."],
    ["Factorise $x^2-x-12$.", ["$(x-4)(x+3)$", "$(x+4)(x-3)$", "$(x-6)(x+2)$", "$(x-12)(x+1)$"], 0, "The numbers $-4$ and $3$ multiply to $-12$ and add to $-1$."],
    ["Simplify $5p-2q+3p+q$.", ["$8p-q$", "$2p+3q$", "$8p+3q$", "$5pq$"], 0, "$5p+3p=8p$ and $-2q+q=-q$."],
    ["Evaluate $2x^2-3x$ when $x=4$.", ["$20$", "$28$", "$32$", "$44$"], 0, "$2(4^2)-3(4)=32-12=20$."],
    ["Simplify $\\frac{6x^2}{3x}$.", ["$2x$", "$3x$", "$2x^2$", "$\\frac{1}{2}x$"], 0, "$6/3=2$ and $x^2/x=x$, so the result is $2x$."],
    ["Expand $(2x-3)(x+4)$.", ["$2x^2+5x-12$", "$2x^2+8x-3$", "$2x^2-11x-12$", "$3x^2+x+12$"], 0, "$2x^2+8x-3x-12=2x^2+5x-12$."],
    ["Factorise $4x^2-25$.", ["$(2x-5)(2x+5)$", "$(4x-5)(x+5)$", "$(2x-25)(2x+1)$", "$(x-5)(4x+5)$"], 0, "Use difference of squares: $(2x)^2-5^2=(2x-5)(2x+5)$."],
    ["Simplify $3(x+2)-2(x-5)$.", ["$x+16$", "$5x-4$", "$x-4$", "$5x+16$"], 0, "$3x+6-2x+10=x+16$."],
    ["Factorise $ab+ac$.", ["$a(b+c)$", "$b(a+c)$", "$c(a+b)$", "$abc$"], 0, "Both terms contain $a$, so factor it out."],
    ["Simplify $(x^3)(x^4)$.", ["$x^7$", "$x^{12}$", "$2x^7$", "$x$"], 0, "For the same base, add powers: $x^3x^4=x^7$."],
    ["Simplify $\\frac{x^5}{x^2}$.", ["$x^3$", "$x^7$", "$x^{10}$", "$x^2$"], 0, "Subtract powers when dividing: $x^{5-2}=x^3$."],
    ["Expand $(x-6)^2$.", ["$x^2-12x+36$", "$x^2-36$", "$x^2+12x+36$", "$x^2-6x+36$"], 0, "$(x-6)^2=x^2-12x+36$."],
    ["Factorise $2x^2+7x+3$.", ["$(2x+1)(x+3)$", "$(2x+3)(x+1)$", "$(x+1)(x+3)$", "$(2x-1)(x-3)$"], 0, "$(2x+1)(x+3)=2x^2+7x+3$."],
    ["Simplify $4a^2b\\times3ab^2$.", ["$12a^3b^3$", "$7a^3b^3$", "$12a^2b^2$", "$12ab$"], 0, "Multiply coefficients and add powers of like bases: $4\\times3a^{3}b^{3}$."],
    ["Factorise $9y^2-16$.", ["$(3y-4)(3y+4)$", "$(9y-4)(y+4)$", "$(3y-16)(3y+1)$", "$(y-4)(9y+4)$"], 0, "$9y^2-16=(3y)^2-4^2=(3y-4)(3y+4)$."],
    ["Simplify $2m(3m-4)+5m$.", ["$6m^2-3m$", "$6m^2-8m$", "$6m^2+m$", "$11m^2-4$"], 0, "$2m(3m-4)+5m=6m^2-8m+5m=6m^2-3m$."],
    ["Factorise $x^2+2x-15$.", ["$(x+5)(x-3)$", "$(x-5)(x+3)$", "$(x+15)(x-1)$", "$(x+2)(x-15)$"], 0, "$5$ and $-3$ multiply to $-15$ and add to $2$."],
    ["If $a=2$ and $b=-3$, evaluate $a^2-2b$.", ["$10$", "$-2$", "$1$", "$14$"], 0, "$a^2-2b=2^2-2(-3)=4+6=10$."],
    ["Simplify $7x-3(2x-4)$.", ["$x+12$", "$x-12$", "$13x-12$", "$5x+4$"], 0, "$7x-6x+12=x+12$."],
    ["Factorise $12pq-8p$.", ["$4p(3q-2)$", "$4q(3p-2)$", "$8p(12q-1)$", "$p(12q-8p)$"], 0, "The common factor is $4p$, giving $4p(3q-2)$."],
    ["Simplify $(2x)^3$.", ["$8x^3$", "$6x^3$", "$2x^3$", "$8x$"], 0, "Cube both the coefficient and the variable: $(2x)^3=8x^3$."],
    ["Expand $(x+2)(x-2)$.", ["$x^2-4$", "$x^2+4$", "$x^2-2x+4$", "$2x^2$"], 0, "This is a difference of squares: $x^2-4$."],
    ["Factorise $3x^2-12x$.", ["$3x(x-4)$", "$3(x-4)$", "$x(3x-12x)$", "$12x(x-3)$"], 0, "The common factor is $3x$, so $3x^2-12x=3x(x-4)$."],
    ["Simplify $\\frac{a}{3}+\\frac{2a}{3}$.", ["$a$", "$3a$", "$\\frac{3a}{6}$", "$\\frac{2a^2}{3}$"], 0, "The denominators are equal, so add numerators: $a/3+2a/3=3a/3=a$."],
    ["Evaluate $x^2+3x+2$ when $x=-1$.", ["$0$", "$2$", "$4$", "$6$"], 0, "$(-1)^2+3(-1)+2=1-3+2=0$."],
    ["Which expression is equivalent to $2(x+4)+3(x-1)$?", ["$5x+5$", "$5x+7$", "$x+5$", "$6x+1$"], 0, "$2x+8+3x-3=5x+5$."],
    ["Factorise $x^2-7x+10$.", ["$(x-5)(x-2)$", "$(x+5)(x+2)$", "$(x-10)(x+1)$", "$(x-7)(x+10)$"], 0, "$-5$ and $-2$ multiply to $10$ and add to $-7$."],
    ["Simplify $4x+2-3x+9$.", ["$x+11$", "$7x+11$", "$x-7$", "$12x$"], 0, "Combine like terms: $4x-3x=x$ and $2+9=11$."],
    ["Factorise $x^2+9x+20$.", ["$(x+4)(x+5)$", "$(x+2)(x+10)$", "$(x-4)(x-5)$", "$(x+20)(x+1)$"], 0, "$4$ and $5$ multiply to $20$ and add to $9$."],
    ["Simplify $2a^2+3a^2-a^2$.", ["$4a^2$", "$4a$", "$6a^2$", "$5a^4$"], 0, "Combine like terms: $(2+3-1)a^2=4a^2$."],
    ["Which is the coefficient of $x$ in $7x-4$?", ["$7$", "$-4$", "$x$", "$3$"], 0, "The coefficient is the number multiplying $x$, which is $7$."],
    ["Which expression has degree $2$?", ["$3x^2+1$", "$5x+4$", "$7$", "$x^3-x$"], 0, "The highest power in $3x^2+1$ is $2$."],
    ["Expand $5(2a-b)$.", ["$10a-5b$", "$10a-b$", "$7a-5b$", "$5a-2b$"], 0, "Multiply both terms by $5$: $10a-5b$."]
  ];
  questions.push(...more.map((args) => q(...args)));
  return bank("algebraic-expressions-factorisation", "Algebraic Expressions & Factorisation", 14, "Expanding, simplifying, substitution, and factorisation practice.", questions);
}

function buildLinear() {
  return patternedBank("linear-equations-relations-functions", "Linear Equations, Relations & Functions", 15, "Solving linear equations, evaluating functions, mappings, relations, domain, and range.", [
    q("Solve $x+7=15$.", ["$8$", "$22$", "$7$", "$15$"], 0, "Subtract $7$ from both sides: $x=8$."),
    q("Solve $3x=24$.", ["$6$", "$8$", "$21$", "$72$"], 1, "Divide both sides by $3$: $x=8$."),
    q("Solve $2x-5=11$.", ["$3$", "$6$", "$8$", "$16$"], 2, "$2x=16$, so $x=8$."),
    q("Solve $5(x-2)=20$.", ["$2$", "$4$", "$6$", "$8$"], 2, "Divide by $5$ to get $x-2=4$, so $x=6$."),
    q("Solve $\\frac{x}{4}+3=9$.", ["$12$", "$18$", "$24$", "$36$"], 2, "$x/4=6$, so $x=24$."),
    q("Solve $3x+4=x+18$.", ["$5$", "$7$", "$9$", "$11$"], 1, "$2x=14$, so $x=7$."),
    q("If $f(x)=2x+3$, find $f(5)$.", ["$10$", "$11$", "$13$", "$15$"], 2, "$f(5)=2(5)+3=13$."),
    q("If $g(x)=x^2-1$, find $g(4)$.", ["$7$", "$15$", "$16$", "$17$"], 1, "$g(4)=4^2-1=15$."),
    q("Find the gradient of $y=4x-7$.", ["$-7$", "$4$", "$7$", "$x$"], 1, "In $y=mx+c$, the gradient is $m$, so it is $4$."),
    q("Find the intercept of $y=3x+5$ on the $y$-axis.", ["$3$", "$5$", "$8$", "$15$"], 1, "The $y$-intercept in $y=mx+c$ is $c$, so it is $5$."),
    q("Which relation is a function?", ["$\\{(1,2),(1,3)\\}$", "$\\{(1,2),(2,3)\\}$", "$\\{(2,4),(2,5)\\}$", "$\\{(3,1),(3,2)\\}$"], 1, "A function gives each input exactly one output."),
    q("For $\\{(1,4),(2,5),(3,6)\\}$, find the domain.", ["$\\{4,5,6\\}$", "$\\{1,2,3\\}$", "$\\{1,4\\}$", "$\\{2,5\\}$"], 1, "The domain is the set of first coordinates."),
    q("For $\\{(1,4),(2,5),(3,6)\\}$, find the range.", ["$\\{1,2,3\\}$", "$\\{4,5,6\\}$", "$\\{1,4\\}$", "$\\{3,6\\}$"], 1, "The range is the set of second coordinates."),
    q("Solve $7-2x=1$.", ["$2$", "$3$", "$4$", "$-3$"], 1, "$-2x=-6$, so $x=3$."),
    q("Solve $4(x+1)=2x+10$.", ["$1$", "$2$", "$3$", "$4$"], 2, "$4x+4=2x+10$, so $2x=6$ and $x=3$."),
    q("If $h(x)=5-x$, find $h(-2)$.", ["$3$", "$5$", "$7$", "$-7$"], 2, "$h(-2)=5-(-2)=7$."),
    q("Find $x$ if $2x+1=9$.", ["$3$", "$4$", "$5$", "$8$"], 1, "$2x=8$, so $x=4$."),
    q("Solve $\\frac{2x-1}{3}=5$.", ["$7$", "$8$", "$9$", "$16$"], 1, "$2x-1=15$, so $2x=16$ and $x=8$."),
    q("Which equation has solution $x=6$?", ["$x+4=9$", "$2x=10$", "$3x-4=14$", "$x-6=6$"], 2, "$3(6)-4=14$, so that equation has solution $6$."),
    q("If $f(x)=3x-2$, find $x$ when $f(x)=10$.", ["$2$", "$3$", "$4$", "$5$"], 2, "Set $3x-2=10$, so $3x=12$ and $x=4$."),
    q("The mapping $x\\mapsto 2x+1$ sends $4$ to:", ["$8$", "$9$", "$10$", "$7$"], 1, "$2(4)+1=9$."),
    q("Which is a linear equation?", ["$x^2+1=0$", "$2x+5=11$", "$xy=6$", "$\\frac{1}{x}=3$"], 1, "$2x+5=11$ has the variable only to the first power."),
    q("Solve $9=2x+1$.", ["$3$", "$4$", "$5$", "$8$"], 1, "$2x=8$, so $x=4$."),
    q("Solve $5x-3=2x+9$.", ["$2$", "$3$", "$4$", "$5$"], 2, "$3x=12$, so $x=4$."),
    q("If $f(x)=x/2+6$, find $f(10)$.", ["$8$", "$10$", "$11$", "$16$"], 2, "$10/2+6=11$."),
    q("Find the inverse operation needed first to solve $x-9=4$.", ["Add $9$", "Subtract $9$", "Multiply by $9$", "Divide by $9$"], 0, "Since $9$ is subtracted, add $9$ to both sides."),
    q("A number is doubled and $5$ is added to get $21$. Find the number.", ["$6$", "$8$", "$10$", "$13$"], 1, "Let the number be $x$. $2x+5=21$, so $x=8$."),
    q("Solve $\\frac{x+2}{5}=4$.", ["$18$", "$20$", "$22$", "$24$"], 0, "$x+2=20$, so $x=18$."),
    q("If $f(x)=4x$, which input gives output $28$?", ["$6$", "$7$", "$8$", "$9$"], 1, "$4x=28$, so $x=7$."),
    q("Which set of ordered pairs fails the vertical-line test idea?", ["$\\{(1,2),(2,2)\\}$", "$\\{(1,2),(1,5)\\}$", "$\\{(2,1),(3,1)\\}$", "$\\{(4,5),(5,6)\\}$"], 1, "Input $1$ has two different outputs, so it is not a function."),
    q("Solve $2(3x-1)=16$.", ["$2$", "$3$", "$4$", "$5$"], 1, "$6x-2=16$, so $6x=18$ and $x=3$."),
    q("Find $f(0)$ if $f(x)=7x-4$.", ["$-4$", "$0$", "$4$", "$7$"], 0, "$f(0)=7(0)-4=-4$."),
    q("Solve $11-x=4$.", ["$5$", "$6$", "$7$", "$15$"], 2, "$-x=-7$, so $x=7$."),
    q("For $y=2x+1$, find $y$ when $x=6$.", ["$11$", "$12$", "$13$", "$14$"], 2, "$y=2(6)+1=13$."),
    q("Which expression represents 'five less than twice $x$'?", ["$5-2x$", "$2x-5$", "$5x-2$", "$2(x-5)$"], 1, "Twice $x$ is $2x$; five less than that is $2x-5$."),
    q("Solve $0.5x=6$.", ["$3$", "$6.5$", "$12$", "$30$"], 2, "$0.5x=6$ means half of $x$ is $6$, so $x=12$."),
    q("If $f(x)=x^2$ and the domain is $\\{-2,3\\}$, find the range.", ["$\\{-2,3\\}$", "$\\{4,9\\}$", "$\\{-4,9\\}$", "$\\{1,6\\}$"], 1, "$(-2)^2=4$ and $3^2=9$, so the range is $\\{4,9\\}$."),
    q("Solve $3(x+2)-x=14$.", ["$2$", "$3$", "$4$", "$5$"], 2, "$3x+6-x=14$, so $2x=8$ and $x=4$."),
    q("Which table could represent $y=x+2$?", ["$(1,3),(2,4)$", "$(1,2),(2,3)$", "$(1,4),(2,5)$", "$(1,1),(2,2)$"], 0, "For $y=x+2$, inputs $1$ and $2$ give outputs $3$ and $4$."),
    q("Solve $\\frac{3x}{2}=12$.", ["$6$", "$8$", "$12$", "$18$"], 1, "Multiply by $2$: $3x=24$, so $x=8$.")
  ]);
}

function buildAngles() {
  return patternedBank("angles-pythagorean-theorem", "Angles & the Pythagorean Theorem", 16, "Angle facts, parallel lines, triangle angles, and Pythagorean calculations.", [
    q("Angles on a straight line add up to:", ["$90^\\circ$", "$180^\\circ$", "$270^\\circ$", "$360^\\circ$"], 1, "Adjacent angles on a straight line sum to $180^\\circ$."),
    q("Angles around a point add up to:", ["$90^\\circ$", "$180^\\circ$", "$270^\\circ$", "$360^\\circ$"], 3, "A full turn around a point is $360^\\circ$."),
    q("The angles in a triangle add up to:", ["$90^\\circ$", "$120^\\circ$", "$180^\\circ$", "$360^\\circ$"], 2, "The interior angles of a triangle sum to $180^\\circ$."),
    q("Find the third angle of a triangle with angles $50^\\circ$ and $60^\\circ$.", ["$60^\\circ$", "$70^\\circ$", "$80^\\circ$", "$90^\\circ$"], 1, "$180-50-60=70^\\circ$."),
    q("A right triangle has shorter sides $6$ cm and $8$ cm. Find the hypotenuse.", ["$10$ cm", "$12$ cm", "$14$ cm", "$48$ cm"], 0, "$c=\\sqrt{6^2+8^2}=\\sqrt{100}=10$ cm."),
    q("A right triangle has hypotenuse $13$ cm and one side $5$ cm. Find the other side.", ["$8$ cm", "$10$ cm", "$12$ cm", "$18$ cm"], 2, "$b=\\sqrt{13^2-5^2}=\\sqrt{169-25}=12$ cm."),
    q("Which triple forms a right-angled triangle?", ["$3,4,5$", "$4,5,6$", "$5,6,7$", "$6,7,8$"], 0, "$3^2+4^2=9+16=25=5^2$."),
    q("Vertically opposite angles are:", ["equal", "supplementary", "complementary", "always right angles"], 0, "Vertically opposite angles are equal."),
    q("Complementary angles add up to:", ["$45^\\circ$", "$90^\\circ$", "$180^\\circ$", "$360^\\circ$"], 1, "Complementary angles have sum $90^\\circ$."),
    q("Supplementary angles add up to:", ["$90^\\circ$", "$120^\\circ$", "$180^\\circ$", "$360^\\circ$"], 2, "Supplementary angles have sum $180^\\circ$."),
    q("Find the supplement of $115^\\circ$.", ["$55^\\circ$", "$65^\\circ$", "$75^\\circ$", "$245^\\circ$"], 1, "$180-115=65^\\circ$."),
    q("Find the complement of $38^\\circ$.", ["$42^\\circ$", "$52^\\circ$", "$62^\\circ$", "$142^\\circ$"], 1, "$90-38=52^\\circ$."),
    q("Each angle of an equilateral triangle is:", ["$30^\\circ$", "$45^\\circ$", "$60^\\circ$", "$90^\\circ$"], 2, "An equilateral triangle has three equal angles, each $180/3=60^\\circ$."),
    q("The base angles of an isosceles triangle are:", ["equal", "right angles", "supplementary", "always obtuse"], 0, "An isosceles triangle has equal base angles."),
    q("A square has diagonal $10$ cm. Find its side length.", ["$5$ cm", "$5\\sqrt2$ cm", "$10\\sqrt2$ cm", "$20$ cm"], 1, "For side $s$, $s^2+s^2=10^2$, so $2s^2=100$ and $s=5\\sqrt2$."),
    q("A ladder $15$ m long reaches a point $12$ m up a wall. How far is its foot from the wall?", ["$3$ m", "$6$ m", "$9$ m", "$12$ m"], 2, "Distance $=\\sqrt{15^2-12^2}=\\sqrt{81}=9$ m."),
    q("If two parallel lines are cut by a transversal, corresponding angles are:", ["equal", "supplementary", "complementary", "unequal"], 0, "Corresponding angles are equal for parallel lines."),
    q("Alternate interior angles between parallel lines are:", ["equal", "right angles", "supplementary", "zero"], 0, "Alternate interior angles are equal when the lines are parallel."),
    q("Interior angles on the same side of a transversal add up to:", ["$90^\\circ$", "$120^\\circ$", "$180^\\circ$", "$360^\\circ$"], 2, "Co-interior angles between parallel lines are supplementary."),
    q("Find $x$ if $x+35^\\circ=90^\\circ$.", ["$45^\\circ$", "$55^\\circ$", "$65^\\circ$", "$125^\\circ$"], 1, "$x=90-35=55^\\circ$."),
    q("Find $x$ if $2x+40^\\circ=180^\\circ$.", ["$50^\\circ$", "$60^\\circ$", "$70^\\circ$", "$80^\\circ$"], 2, "$2x=140$, so $x=70^\\circ$."),
    q("The exterior angle of a triangle equals:", ["sum of the two opposite interior angles", "sum of all three interior angles", "half the opposite angle", "the adjacent interior angle"], 0, "An exterior angle equals the sum of the two remote interior angles."),
    q("A triangle has sides $7,24,25$. What type is it?", ["right-angled", "equilateral", "isosceles only", "not a triangle"], 0, "$7^2+24^2=49+576=625=25^2$."),
    q("Find the diagonal of a rectangle $9$ cm by $12$ cm.", ["$15$ cm", "$18$ cm", "$21$ cm", "$24$ cm"], 0, "$d=\\sqrt{9^2+12^2}=15$ cm."),
    q("If an angle is $x$ and its vertically opposite angle is $78^\\circ$, find $x$.", ["$78^\\circ$", "$102^\\circ$", "$156^\\circ$", "$282^\\circ$"], 0, "Vertically opposite angles are equal."),
    q("A triangle has angles $x,2x,3x$. Find $x$.", ["$20^\\circ$", "$30^\\circ$", "$40^\\circ$", "$60^\\circ$"], 1, "$x+2x+3x=180$, so $6x=180$ and $x=30^\\circ$."),
    q("Which angle is obtuse?", ["$45^\\circ$", "$90^\\circ$", "$125^\\circ$", "$360^\\circ$"], 2, "An obtuse angle is greater than $90^\\circ$ and less than $180^\\circ$."),
    q("Which angle is reflex?", ["$80^\\circ$", "$180^\\circ$", "$240^\\circ$", "$90^\\circ$"], 2, "A reflex angle is greater than $180^\\circ$ and less than $360^\\circ$."),
    q("Find the length of the hypotenuse when the legs are $9$ and $40$.", ["$41$", "$49$", "$31$", "$1600$"], 0, "$9^2+40^2=81+1600=1681=41^2$."),
    q("Find the missing leg if the hypotenuse is $10$ and one leg is $8$.", ["$4$", "$5$", "$6$", "$7$"], 2, "$\\sqrt{10^2-8^2}=\\sqrt{36}=6$."),
    q("A rhombus has perpendicular diagonals $6$ cm and $8$ cm. Find the side length.", ["$5$ cm", "$7$ cm", "$10$ cm", "$14$ cm"], 0, "Half-diagonals are $3$ and $4$, so the side is $\\sqrt{3^2+4^2}=5$ cm."),
    q("The angle sum of a quadrilateral is:", ["$180^\\circ$", "$270^\\circ$", "$360^\\circ$", "$540^\\circ$"], 2, "A quadrilateral can be split into two triangles, so its angle sum is $360^\\circ$."),
    q("Find one angle of a regular hexagon.", ["$90^\\circ$", "$108^\\circ$", "$120^\\circ$", "$135^\\circ$"], 2, "Interior angle of a regular $n$-gon is $(n-2)180/n$. For $6$, it is $120^\\circ$."),
    q("The exterior angle of a regular pentagon is:", ["$36^\\circ$", "$60^\\circ$", "$72^\\circ$", "$108^\\circ$"], 2, "Each exterior angle is $360/5=72^\\circ$."),
    q("If a bearing is $090^\\circ$, the direction is:", ["North", "East", "South", "West"], 1, "A bearing of $090^\\circ$ points due East."),
    q("If $a^2+b^2<c^2$ for the longest side $c$, the triangle is:", ["acute", "right-angled", "obtuse", "equilateral"], 2, "When the square of the longest side is greater than the sum of the other squares, the triangle is obtuse."),
    q("Find the distance between $(0,0)$ and $(6,8)$.", ["$7$", "$10$", "$12$", "$14$"], 1, "Use Pythagoras: $\\sqrt{6^2+8^2}=10$."),
    q("A pole casts a shadow $5$ m long. The top of the pole is $13$ m from the tip of the shadow. Find the pole height.", ["$8$ m", "$10$ m", "$12$ m", "$15$ m"], 2, "Height $=\\sqrt{13^2-5^2}=12$ m."),
    q("If two angles are supplementary and one is $4$ times the other, find the smaller angle.", ["$30^\\circ$", "$36^\\circ$", "$45^\\circ$", "$60^\\circ$"], 1, "Let the smaller angle be $x$. Then $x+4x=180$, so $x=36^\\circ$."),
    q("The longest side of a right triangle is called the:", ["base", "height", "hypotenuse", "median"], 2, "The side opposite the right angle is the hypotenuse.")
  ]);
}

function buildMeasurement() {
  return patternedBank("perimeter-area-volume", "Perimeter, Area & Volume", 17, "Perimeter, area, circumference, surface area, volume, and unit conversion.", [
    q("Find the perimeter of a rectangle $8$ cm by $5$ cm.", ["$13$ cm", "$26$ cm", "$40$ cm", "$80$ cm"], 1, "Perimeter is $2(l+w)=2(8+5)=26$ cm."),
    q("Find the area of a rectangle $8$ cm by $5$ cm.", ["$13$ cm$^2$", "$26$ cm$^2$", "$40$ cm$^2$", "$80$ cm$^2$"], 2, "Area is $lw=8\\times5=40$ cm$^2$."),
    q("Find the area of a triangle with base $10$ cm and height $6$ cm.", ["$16$ cm$^2$", "$30$ cm$^2$", "$60$ cm$^2$", "$100$ cm$^2$"], 1, "Area is $\\frac12 bh=\\frac12(10)(6)=30$ cm$^2$."),
    q("Find the circumference of a circle with radius $7$ cm, using $\\pi=\\frac{22}{7}$.", ["$22$ cm", "$44$ cm", "$49$ cm", "$154$ cm"], 1, "$C=2\\pi r=2\\times22/7\\times7=44$ cm."),
    q("Find the area of a circle with radius $7$ cm, using $\\pi=\\frac{22}{7}$.", ["$44$ cm$^2$", "$77$ cm$^2$", "$154$ cm$^2$", "$308$ cm$^2$"], 2, "$A=\\pi r^2=22/7\\times49=154$ cm$^2$."),
    q("Find the volume of a cuboid $4$ cm by $5$ cm by $6$ cm.", ["$15$ cm$^3$", "$60$ cm$^3$", "$120$ cm$^3$", "$240$ cm$^3$"], 2, "Volume is $lwh=4\\times5\\times6=120$ cm$^3$."),
    q("Find the volume of a cube of side $3$ cm.", ["$9$ cm$^3$", "$18$ cm$^3$", "$27$ cm$^3$", "$81$ cm$^3$"], 2, "Volume of a cube is $s^3=3^3=27$ cm$^3$."),
    q("Find the total surface area of a cube of side $4$ cm.", ["$16$ cm$^2$", "$64$ cm$^2$", "$96$ cm$^2$", "$256$ cm$^2$"], 2, "A cube has $6$ square faces, so surface area is $6\\times4^2=96$ cm$^2$."),
    q("Find the area of a parallelogram with base $12$ cm and height $5$ cm.", ["$17$ cm$^2$", "$30$ cm$^2$", "$60$ cm$^2$", "$120$ cm$^2$"], 2, "Area of a parallelogram is $bh=12\\times5=60$ cm$^2$."),
    q("Find the area of a trapezium with parallel sides $8$ cm and $12$ cm and height $5$ cm.", ["$40$ cm$^2$", "$50$ cm$^2$", "$60$ cm$^2$", "$100$ cm$^2$"], 1, "Area is $\\frac12(a+b)h=\\frac12(8+12)5=50$ cm$^2$."),
    q("Convert $2.5$ m to centimetres.", ["$25$ cm", "$250$ cm", "$2500$ cm", "$0.25$ cm"], 1, "$1$ m is $100$ cm, so $2.5$ m is $250$ cm."),
    q("Convert $3000$ cm$^3$ to litres.", ["$0.3$ L", "$3$ L", "$30$ L", "$300$ L"], 1, "$1000$ cm$^3=1$ litre, so $3000$ cm$^3=3$ litres."),
    q("Find the perimeter of a square of side $9$ cm.", ["$18$ cm", "$27$ cm", "$36$ cm", "$81$ cm"], 2, "Perimeter of a square is $4s=4\\times9=36$ cm."),
    q("Find the area of a square of side $9$ cm.", ["$18$ cm$^2$", "$36$ cm$^2$", "$81$ cm$^2$", "$729$ cm$^2$"], 2, "Area is $s^2=9^2=81$ cm$^2$."),
    q("Find the volume of a cylinder with radius $3$ cm and height $10$ cm, using $\\pi=3.14$.", ["$94.2$ cm$^3$", "$188.4$ cm$^3$", "$282.6$ cm$^3$", "$314$ cm$^3$"], 2, "$V=\\pi r^2h=3.14\\times9\\times10=282.6$ cm$^3$."),
    q("Find the curved surface area of a cylinder with radius $7$ cm and height $10$ cm, using $\\pi=\\frac{22}{7}$.", ["$220$ cm$^2$", "$330$ cm$^2$", "$440$ cm$^2$", "$1540$ cm$^2$"], 2, "Curved surface area is $2\\pi rh=2\\times22/7\\times7\\times10=440$ cm$^2$."),
    q("A rectangular floor is $6$ m by $4$ m. Find its area.", ["$10$ m$^2$", "$20$ m$^2$", "$24$ m$^2$", "$48$ m$^2$"], 2, "Area is $6\\times4=24$ m$^2$."),
    q("How many $1$ cm cubes fit in a cuboid $5$ cm by $4$ cm by $3$ cm?", ["$12$", "$20$", "$60$", "$120$"], 2, "The number of unit cubes equals the volume: $5\\times4\\times3=60$."),
    q("Find the perimeter of a triangle with sides $5$ cm, $7$ cm, and $9$ cm.", ["$12$ cm", "$16$ cm", "$21$ cm", "$35$ cm"], 2, "Perimeter is the sum of the sides: $5+7+9=21$ cm."),
    q("A circle has diameter $14$ cm. Find its radius.", ["$7$ cm", "$14$ cm", "$28$ cm", "$49$ cm"], 0, "The radius is half the diameter: $14/2=7$ cm."),
    q("Find the area of a semicircle of radius $7$ cm using $\\pi=\\frac{22}{7}$.", ["$77$ cm$^2$", "$154$ cm$^2$", "$44$ cm$^2$", "$22$ cm$^2$"], 0, "A semicircle is half a circle: $\\frac12\\times22/7\\times49=77$ cm$^2$."),
    q("Find the volume of a prism with cross-sectional area $18$ cm$^2$ and length $9$ cm.", ["$27$ cm$^3$", "$81$ cm$^3$", "$162$ cm$^3$", "$324$ cm$^3$"], 2, "Volume of a prism is cross-sectional area times length: $18\\times9=162$ cm$^3$."),
    q("Find the total surface area of a cuboid $2$ cm by $3$ cm by $4$ cm.", ["$24$ cm$^2$", "$36$ cm$^2$", "$52$ cm$^2$", "$72$ cm$^2$"], 2, "Surface area is $2(lw+lh+wh)=2(6+8+12)=52$ cm$^2$."),
    q("A rectangle has area $48$ cm$^2$ and length $12$ cm. Find its width.", ["$3$ cm", "$4$ cm", "$6$ cm", "$36$ cm"], 1, "Width is area divided by length: $48/12=4$ cm."),
    q("A square has perimeter $28$ cm. Find its side.", ["$4$ cm", "$7$ cm", "$14$ cm", "$28$ cm"], 1, "Each side is $28/4=7$ cm."),
    q("Find the circumference of a circle with diameter $21$ cm using $\\pi=\\frac{22}{7}$.", ["$44$ cm", "$66$ cm", "$132$ cm", "$462$ cm"], 1, "$C=\\pi d=22/7\\times21=66$ cm."),
    q("Find the area of a rhombus with diagonals $10$ cm and $12$ cm.", ["$30$ cm$^2$", "$60$ cm$^2$", "$120$ cm$^2$", "$240$ cm$^2$"], 1, "Area of a rhombus is $\\frac12 d_1d_2=\\frac12(10)(12)=60$ cm$^2$."),
    q("A cuboid has volume $96$ cm$^3$, length $8$ cm, and width $4$ cm. Find its height.", ["$2$ cm", "$3$ cm", "$4$ cm", "$12$ cm"], 1, "Height is $96/(8\\times4)=3$ cm."),
    q("Convert $5$ hectares to square metres.", ["$500$ m$^2$", "$5000$ m$^2$", "$50000$ m$^2$", "$500000$ m$^2$"], 2, "$1$ hectare is $10000$ m$^2$, so $5$ hectares is $50000$ m$^2$."),
    q("Find the area of a sector with angle $90^\\circ$ and radius $14$ cm using $\\pi=\\frac{22}{7}$.", ["$77$ cm$^2$", "$154$ cm$^2$", "$308$ cm$^2$", "$616$ cm$^2$"], 1, "Sector area is $90/360\\times\\pi r^2=1/4\\times22/7\\times196=154$ cm$^2$."),
    q("Find the arc length of a $60^\\circ$ sector of radius $21$ cm using $\\pi=\\frac{22}{7}$.", ["$11$ cm", "$22$ cm", "$44$ cm", "$132$ cm"], 1, "Arc length is $60/360\\times2\\pi r=1/6\\times2\\times22/7\\times21=22$ cm."),
    q("A compound shape is made from two rectangles of areas $24$ cm$^2$ and $15$ cm$^2$. Find the total area.", ["$9$ cm$^2$", "$24$ cm$^2$", "$39$ cm$^2$", "$360$ cm$^2$"], 2, "Add the non-overlapping areas: $24+15=39$ cm$^2$."),
    q("Find the volume of a cone with radius $3$ cm and height $8$ cm using $\\pi=3$.", ["$24$ cm$^3$", "$48$ cm$^3$", "$72$ cm$^3$", "$216$ cm$^3$"], 2, "$V=\\frac13\\pi r^2h=\\frac13\\times3\\times9\\times8=72$ cm$^3$."),
    q("Find the volume of a sphere of radius $3$ cm using $\\pi=3$.", ["$36$ cm$^3$", "$72$ cm$^3$", "$108$ cm$^3$", "$144$ cm$^3$"], 2, "$V=\\frac43\\pi r^3=\\frac43\\times3\\times27=108$ cm$^3$."),
    q("A path around a square garden has outer side $12$ m and inner side $10$ m. Find the area of the path.", ["$22$ m$^2$", "$44$ m$^2$", "$100$ m$^2$", "$144$ m$^2$"], 1, "Area of path is outer area minus inner area: $12^2-10^2=144-100=44$ m$^2$."),
    q("Find the area of a kite with diagonals $8$ cm and $15$ cm.", ["$23$ cm$^2$", "$46$ cm$^2$", "$60$ cm$^2$", "$120$ cm$^2$"], 2, "Area of a kite is $\\frac12 d_1d_2=\\frac12(8)(15)=60$ cm$^2$."),
    q("Find the perimeter of a regular pentagon of side $6$ cm.", ["$11$ cm", "$25$ cm", "$30$ cm", "$36$ cm"], 2, "A regular pentagon has five equal sides, so perimeter is $5\\times6=30$ cm."),
    q("A tank holds $2.4$ m$^3$ of water. How many litres is this?", ["$24$ L", "$240$ L", "$2400$ L", "$24000$ L"], 2, "$1$ m$^3=1000$ L, so $2.4$ m$^3=2400$ L."),
    q("Find the side of a square whose area is $121$ cm$^2$.", ["$10$ cm", "$11$ cm", "$12$ cm", "$22$ cm"], 1, "The side is $\\sqrt{121}=11$ cm."),
    q("Find the area of a rectangle whose perimeter is $30$ cm and length is $9$ cm.", ["$45$ cm$^2$", "$54$ cm$^2$", "$63$ cm$^2$", "$81$ cm$^2$"], 1, "For a rectangle, $2(l+w)=30$, so $l+w=15$. With $l=9$, $w=6$, and area is $9\\times6=54$ cm$^2$.")
  ]);
}

function buildIndependentProbability() {
  return patternedBank("probability-independent-events", "Probability of Independent Events", 18, "Simple probability, multiplication rule, complements, and independent-event reasoning.", [
    q("A fair coin is tossed once. Find the probability of getting heads.", ["$0$", "$\\frac12$", "$1$", "$2$"], 1, "A fair coin has two equally likely outcomes, so $P(H)=1/2$."),
    q("A fair die is rolled once. Find the probability of getting a $4$.", ["$\\frac16$", "$\\frac14$", "$\\frac12$", "$\\frac56$"], 0, "There is one favourable outcome out of six."),
    q("A fair die is rolled once. Find the probability of getting an even number.", ["$\\frac16$", "$\\frac13$", "$\\frac12$", "$\\frac23$"], 2, "The even outcomes are $2,4,6$, so probability is $3/6=1/2$."),
    q("Two fair coins are tossed. Find the probability of getting two heads.", ["$\\frac14$", "$\\frac12$", "$\\frac34$", "$1$"], 0, "$P(HH)=1/2\\times1/2=1/4$."),
    q("A coin is tossed and a die is rolled. Find the probability of heads and a $6$.", ["$\\frac16$", "$\\frac18$", "$\\frac1{12}$", "$\\frac12$"], 2, "The events are independent, so multiply: $1/2\\times1/6=1/12$."),
    q("Two fair dice are rolled. Find the probability of getting two sixes.", ["$\\frac16$", "$\\frac1{12}$", "$\\frac1{36}$", "$\\frac{6}{36}$"], 2, "$P(6,6)=1/6\\times1/6=1/36$."),
    q("If $P(A)=\\frac{2}{5}$ and $P(B)=\\frac{3}{4}$ for independent events, find $P(A\\cap B)$.", ["$\\frac{6}{20}$", "$\\frac{5}{9}$", "$\\frac{6}{9}$", "$\\frac{1}{10}$"], 0, "For independent events, $P(A\\cap B)=P(A)P(B)=2/5\\times3/4=6/20=3/10$."),
    q("If $P(A)=0.3$, find $P(A')$.", ["$0.3$", "$0.6$", "$0.7$", "$1.3$"], 2, "$P(A')=1-P(A)=1-0.3=0.7$."),
    q("A bag has $3$ red and $2$ blue balls. One ball is picked at random. Find $P(blue)$.", ["$\\frac25$", "$\\frac23$", "$\\frac35$", "$\\frac12$"], 0, "There are $2$ blue balls out of $5$ balls."),
    q("A bag has $4$ red and $6$ green balls. A ball is picked, replaced, and another is picked. Find the probability both are red.", ["$\\frac{2}{5}$", "$\\frac{4}{25}$", "$\\frac{8}{25}$", "$\\frac{16}{100}$"], 3, "With replacement, the events are independent: $4/10\\times4/10=16/100=4/25$."),
    q("What does it mean for two events to be independent?", ["One event prevents the other.", "One event changes the probability of the other.", "One event does not affect the probability of the other.", "They cannot occur together."], 2, "Independent events do not change each other's probabilities."),
    q("If $P(A)=\\frac14$ and $P(B)=\\frac12$, independent, find $P(A\\text{ and not }B)$.", ["$\\frac18$", "$\\frac14$", "$\\frac38$", "$\\frac34$"], 0, "$P(A\\cap B')=P(A)P(B')=1/4\\times1/2=1/8$."),
    q("A fair die is rolled twice. Find the probability of getting an odd number both times.", ["$\\frac14$", "$\\frac12$", "$\\frac34$", "$1$"], 0, "Each roll has probability $3/6=1/2$ of odd, so both odd is $1/2\\times1/2=1/4$."),
    q("A card is drawn from a standard deck. Find the probability of drawing a heart.", ["$\\frac14$", "$\\frac12$", "$\\frac1{13}$", "$\\frac4{13}$"], 0, "There are $13$ hearts out of $52$ cards, so $13/52=1/4$."),
    q("A card is drawn from a standard deck. Find the probability of drawing an ace.", ["$\\frac1{52}$", "$\\frac1{13}$", "$\\frac14$", "$\\frac4{13}$"], 1, "There are $4$ aces out of $52$ cards, so $4/52=1/13$."),
    q("A coin is tossed three times. Find the probability of getting all tails.", ["$\\frac12$", "$\\frac14$", "$\\frac18$", "$\\frac38$"], 2, "$1/2\\times1/2\\times1/2=1/8$."),
    q("If the probability of rain is $0.2$, find the probability that it will not rain.", ["$0.2$", "$0.4$", "$0.8$", "$1.2$"], 2, "The complement is $1-0.2=0.8$."),
    q("A spinner has equal sectors numbered $1$ to $5$. Find the probability of landing on a number greater than $3$.", ["$\\frac15$", "$\\frac25$", "$\\frac35$", "$\\frac45$"], 1, "The favourable outcomes are $4$ and $5$, so probability is $2/5$."),
    q("Two independent events have probabilities $0.6$ and $0.5$. Find the probability that both occur.", ["$0.1$", "$0.3$", "$0.6$", "$1.1$"], 1, "Multiply: $0.6\\times0.5=0.3$."),
    q("Two fair dice are rolled. Find the probability of getting a sum of $7$.", ["$\\frac16$", "$\\frac1{12}$", "$\\frac7{36}$", "$\\frac12$"], 0, "The six favourable pairs are $(1,6),(2,5),(3,4),(4,3),(5,2),(6,1)$, so probability is $6/36=1/6$."),
    q("A fair die is rolled twice. Find the probability of no six appearing.", ["$\\frac{25}{36}$", "$\\frac{11}{36}$", "$\\frac16$", "$\\frac56$"], 0, "Probability of no six on one roll is $5/6$, so on two rolls it is $5/6\\times5/6=25/36$."),
    q("A coin is tossed twice. Find the probability of at least one head.", ["$\\frac14$", "$\\frac12$", "$\\frac34$", "$1$"], 2, "Use the complement: no heads is TT with probability $1/4$, so at least one head is $1-1/4=3/4$."),
    q("A bag has $5$ black and $5$ white balls. A ball is picked, replaced, and another is picked. Find $P(white, then black)$.", ["$\\frac14$", "$\\frac12$", "$\\frac34$", "$1$"], 0, "$P(W)P(B)=1/2\\times1/2=1/4$."),
    q("If $P(A\\cap B)=P(A)P(B)$, then $A$ and $B$ are:", ["mutually exclusive", "independent", "complementary", "impossible"], 1, "This product rule is the test for independence."),
    q("A fair die is rolled. Find the probability of not getting a $1$.", ["$\\frac16$", "$\\frac56$", "$\\frac12$", "$1$"], 1, "Five outcomes are not $1$, so probability is $5/6$."),
    q("Two coins are tossed. Find the probability of exactly one head.", ["$\\frac14$", "$\\frac12$", "$\\frac34$", "$1$"], 1, "The outcomes HT and TH are favourable, so $2/4=1/2$."),
    q("A box has $2$ defective bulbs out of $10$. Find the probability of selecting a good bulb.", ["$\\frac15$", "$\\frac45$", "$\\frac12$", "$\\frac25$"], 1, "There are $8$ good bulbs out of $10$, so $8/10=4/5$."),
    q("If $P(A)=0$, event $A$ is:", ["certain", "impossible", "independent", "likely"], 1, "A probability of $0$ means the event cannot occur."),
    q("If $P(A)=1$, event $A$ is:", ["impossible", "unlikely", "certain", "independent"], 2, "A probability of $1$ means the event must occur."),
    q("Which value cannot be a probability?", ["$0$", "$\\frac12$", "$1$", "$1.2$"], 3, "Probabilities must lie between $0$ and $1$ inclusive."),
    q("A fair die is rolled and a fair coin is tossed. How many equally likely outcomes are there?", ["$6$", "$8$", "$12$", "$36$"], 2, "There are $6$ die outcomes and $2$ coin outcomes, so $6\\times2=12$."),
    q("A password uses one letter from $A,B,C$ and one digit from $1,2,3,4$. How many outcomes are possible?", ["$7$", "$12$", "$24$", "$34$"], 1, "Use the multiplication rule: $3\\times4=12$."),
    q("If two events are mutually exclusive and both have non-zero probability, are they independent?", ["Always", "Never", "Only if equal", "Only if complements"], 1, "If one occurs, the other cannot occur, so the probability of the other changes."),
    q("A bag has $3$ red and $7$ blue balls. With replacement, find the probability of drawing red twice.", ["$\\frac{3}{10}$", "$\\frac{6}{20}$", "$\\frac{9}{100}$", "$\\frac{21}{100}$"], 2, "$3/10\\times3/10=9/100$."),
    q("A family has two children. Assuming boy and girl are equally likely, find the probability both are girls.", ["$\\frac14$", "$\\frac12$", "$\\frac34$", "$1$"], 0, "The equally likely outcomes are BB, BG, GB, GG. Only GG works."),
    q("A fair die is rolled twice. Find the probability that the first roll is $2$ and the second is greater than $4$.", ["$\\frac1{18}$", "$\\frac1{12}$", "$\\frac13$", "$\\frac12$"], 0, "$P(2)=1/6$ and $P(>4)=2/6=1/3$, so product is $1/18$."),
    q("A spinner has $8$ equal sectors, $3$ of which are red. Find $P(not red)$.", ["$\\frac38$", "$\\frac58$", "$\\frac35$", "$\\frac83$"], 1, "Five of the eight sectors are not red."),
    q("A coin is tossed four times. Find the probability of four heads.", ["$\\frac1{16}$", "$\\frac14$", "$\\frac18$", "$\\frac12$"], 0, "$(1/2)^4=1/16$."),
    q("A die is rolled once. Find $P($prime number$)$.", ["$\\frac13$", "$\\frac12$", "$\\frac23$", "$\\frac56$"], 1, "Prime outcomes on a die are $2,3,5$, so $3/6=1/2$."),
    q("If $P(A)=\\frac35$, find the odds against $A$ as a probability of not $A$.", ["$\\frac25$", "$\\frac35$", "$\\frac23$", "$\\frac32$"], 0, "$P(A')=1-3/5=2/5$.")
  ]);
}

function buildDataOrganisation() {
  return patternedBank("data-organisation-analysis-presentation", "Data Organisation, Analysis & Presentation", 19, "Collecting, organising, presenting, and interpreting data in tables and charts.", [
    q("The data $2,4,4,5,10$ has mode:", ["$2$", "$4$", "$5$", "$10$"], 1, "The mode is the value that occurs most often. Here $4$ occurs twice."),
    q("Find the mean of $3,5,7,9$.", ["$5$", "$6$", "$7$", "$8$"], 1, "The sum is $24$ and there are $4$ values, so mean is $6$."),
    q("Find the median of $1,3,8,10,12$.", ["$3$", "$8$", "$10$", "$12$"], 1, "The middle value is $8$."),
    q("Find the range of $6,9,2,11,5$.", ["$5$", "$7$", "$9$", "$11$"], 2, "Range is largest minus smallest: $11-2=9$."),
    q("A tally mark group of four is usually written as:", ["four vertical strokes", "one crossed group of five", "two crossed groups", "a bar chart"], 0, "Four tally marks are four separate strokes; the fifth crosses them."),
    q("Which graph is best for comparing categories?", ["Bar chart", "Line graph", "Scatter graph", "Histogram only"], 0, "A bar chart is used to compare separate categories."),
    q("Which graph is best for showing change over time?", ["Pie chart", "Line graph", "Pictogram", "Venn diagram"], 1, "A line graph shows trends over time clearly."),
    q("A pie chart represents a whole as:", ["$90^\\circ$", "$180^\\circ$", "$270^\\circ$", "$360^\\circ$"], 3, "A full pie chart is a full circle, so it has $360^\\circ$."),
    q("In a class of $30$, $12$ learners like football. What pie-chart angle represents football?", ["$72^\\circ$", "$120^\\circ$", "$144^\\circ$", "$180^\\circ$"], 2, "$12/30\\times360=144^\\circ$."),
    q("A frequency table shows score $5$ has frequency $8$. What does this mean?", ["The score is $8$.", "$5$ occurred $8$ times.", "$8$ occurred $5$ times.", "The mean is $5$."], 1, "Frequency tells how many times a value occurs."),
    q("Find the total frequency: $3,5,7,10$.", ["$10$", "$15$", "$25$", "$35$"], 2, "Add the frequencies: $3+5+7+10=25$."),
    q("Scores $1,2,3$ have frequencies $4,5,1$. Find the mean score.", ["$1.7$", "$2.0$", "$2.3$", "$10$"], 0, "Weighted total is $1(4)+2(5)+3(1)=17$; total frequency is $10$, so mean is $1.7$."),
    q("Which is primary data?", ["Data copied from a textbook", "Data collected by the researcher directly", "Data from an old newspaper", "Data from a website only"], 1, "Primary data is collected directly for the investigation."),
    q("Which is secondary data?", ["Measurements taken in class today", "Responses from your own survey", "Data from a published report", "Your own experiment results"], 2, "Secondary data has already been collected by another source."),
    q("A questionnaire is mainly used to collect:", ["survey responses", "circle areas", "angle sizes", "multiplication tables"], 0, "Questionnaires collect responses from people."),
    q("Which average is most affected by an extreme value?", ["Mean", "Median", "Mode", "Range only"], 0, "The mean uses every value, so an extreme value can change it strongly."),
    q("The median is useful because it is:", ["always the largest value", "less affected by extremes", "always equal to the mean", "the total frequency"], 1, "The median depends on position, so extreme values affect it less."),
    q("If a pictogram key says one symbol represents $5$ learners, how many learners do $7$ symbols represent?", ["$12$", "$25$", "$35$", "$75$"], 2, "$7\\times5=35$ learners."),
    q("If $20\\%$ of a pie chart is shaded, find the angle shaded.", ["$20^\\circ$", "$36^\\circ$", "$72^\\circ$", "$90^\\circ$"], 2, "$20\\%$ of $360^\\circ$ is $72^\\circ$."),
    q("The class interval $10-19$ has class width:", ["$9$", "$10$", "$19$", "$29$"], 1, "For whole-number classes, $10-19$ covers $10$ values."),
    q("The midpoint of the class interval $20-30$ is:", ["$10$", "$20$", "$25$", "$30$"], 2, "Midpoint is $(20+30)/2=25$."),
    q("A histogram is mainly used for:", ["continuous grouped data", "names of learners", "set complements", "angles only"], 0, "Histograms display continuous grouped data."),
    q("A bar chart should have bars that are:", ["touching always", "separated for categories", "circular", "slanted only"], 1, "For separate categories, bar-chart bars are usually separated."),
    q("Find the mode of $7,8,8,9,9,9,10$.", ["$7$", "$8$", "$9$", "$10$"], 2, "$9$ occurs three times, more than any other value."),
    q("Find the median of $4,6,8,10$.", ["$6$", "$7$", "$8$", "$9$"], 1, "For four values, median is the average of the two middle values: $(6+8)/2=7$."),
    q("Find the mean of $2,2,6,10$.", ["$4$", "$5$", "$6$", "$20$"], 1, "The sum is $20$ and there are $4$ values, so mean is $5$."),
    q("Which data type is qualitative?", ["Height", "Mass", "Eye colour", "Age"], 2, "Eye colour is a category, not a numerical measurement."),
    q("Which data type is quantitative?", ["Favourite food", "House colour", "Number of siblings", "Type of transport"], 2, "Number of siblings is numerical."),
    q("A sample is:", ["the whole population", "a part of the population selected for study", "always zero", "only grouped data"], 1, "A sample is a selected part of the population."),
    q("A population is:", ["all items or people under study", "only one respondent", "the frequency column", "a bar in a chart"], 0, "The population is the full group being studied."),
    q("Which method is likely to give a biased sample?", ["Randomly selecting names", "Surveying only your friends", "Using a number generator", "Drawing names from a box"], 1, "Surveying only friends is unlikely to represent the whole population fairly."),
    q("The cumulative frequency after frequencies $2,4,6$ is:", ["$6$", "$10$", "$12$", "$24$"], 2, "Cumulative frequency adds up to that point: $2+4+6=12$."),
    q("If the total frequency is $50$, the median position is approximately:", ["$10.5$th", "$25.5$th", "$50$th", "$100$th"], 1, "Median position is $(n+1)/2=(50+1)/2=25.5$."),
    q("Which display is best for showing parts of a whole?", ["Pie chart", "Line graph", "Scatter plot", "Stem-and-leaf only"], 0, "A pie chart shows how a whole is divided into parts."),
    q("A stem-and-leaf plot preserves:", ["original data values", "only percentages", "only angles", "only colours"], 0, "Stem-and-leaf plots show the individual data values."),
    q("For data $5,5,6,8,11$, find the range.", ["$5$", "$6$", "$8$", "$11$"], 1, "Range is $11-5=6$."),
    q("If a bar has height $12$ on a frequency chart, the frequency is:", ["$6$", "$12$", "$24$", "$144$"], 1, "The height of the bar represents the frequency."),
    q("Which question is better for collecting numerical data?", ["What is your height?", "What colour do you like?", "Which team do you support?", "What is your favourite subject?"], 0, "Height is a numerical measurement."),
    q("A pie-chart sector of $90^\\circ$ represents what fraction of the data?", ["$\\frac14$", "$\\frac12$", "$\\frac34$", "$\\frac19$"], 0, "$90/360=1/4$."),
    q("If $8$ out of $40$ learners walk to school, what percentage walk?", ["$8\\%$", "$20\\%$", "$32\\%$", "$40\\%$"], 1, "$8/40\\times100\\%=20\\%$.")
  ]);
}

function patternedBank(id, title, module, description, questions) {
  return bank(id, title, module, description, questions);
}

function bank(id, title, module, description, questions) {
  if (questions.length !== 40) {
    throw new Error(`${id} has ${questions.length} questions instead of 40.`);
  }
  return { id, title, module, description, questions };
}

for (const topic of topics) {
  writeFileSync(join(process.cwd(), "data", `${topic.id}.json`), `${JSON.stringify(topic, null, 2)}\n`);
  console.log(`Wrote data/${topic.id}.json`);
}
