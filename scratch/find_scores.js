// Find all possible integer scores that can result in the screenshot percentages
const tieOrder = ['coffee', 'vanilla', 'chilli', 'jelly', 'green'];
const keys = ['coffee', 'chilli', 'vanilla', 'jelly', 'green'];

// Let's iterate over total score (sum of all scores) from 1 to 200
for (let total = 10; total <= 200; total++) {
  // We want to find scores for coffee, chilli, vanilla, jelly, green
  // that sum to total, and their percentages when computed using the same algorithm
  // match green: 27%, coffee: 26%, chilli: 20%, vanilla: 15%, jelly: 12%
  // or green: 27%, coffee: 26%
  for (let coffee = 0; coffee <= total; coffee++) {
    for (let chilli = 0; chilli <= total - coffee; chilli++) {
      for (let vanilla = 0; vanilla <= total - coffee - chilli; vanilla++) {
        for (let jelly = 0; jelly <= total - coffee - chilli - vanilla; jelly++) {
          const green = total - coffee - chilli - vanilla - jelly;
          
          const scores = { coffee, chilli, vanilla, jelly, green };
          
          // Run the percentage calculation algorithm from the code:
          const percents = {};
          let sum = 0;
          let maxKey = 'coffee';
          let maxVal = -1;

          for (const key of keys) {
            const p = Math.round((scores[key] / total) * 100);
            percents[key] = p;
            sum += p;
            if (p > maxVal) {
              maxVal = p;
              maxKey = key;
            }
          }

          const diff = 100 - sum;
          if (diff !== 0) {
            percents[maxKey] += diff;
          }

          // Sort percentages
          const sorted = Object.entries(percents).sort((a, b) => b[1] - a[1]);
          
          // Check if sorted matches:
          // green: 27, coffee: 26, chilli: 20, vanilla: 15, jelly: 12
          if (percents.green === 27 && percents.coffee === 26 && percents.chilli === 20 && percents.vanilla === 15 && percents.jelly === 12) {
            // Calculate winner using getWinningBean (old)
            let winnerOld = tieOrder[0];
            let maxOld = -1;
            tieOrder.forEach((bean) => {
              if (scores[bean] > maxOld) {
                maxOld = scores[bean];
                winnerOld = bean;
              }
            });

            // Calculate winner using new getWinningBean (new)
            const winnerNew = sorted[0][0];
            
            console.log(`Total: ${total} | Scores: coffee:${coffee}, green:${green}, chilli:${chilli}, vanilla:${vanilla}, jelly:${jelly} | Winner Old: ${winnerOld} | Winner New: ${winnerNew}`);
          }
        }
      }
    }
  }
}
