process.stdin.setEncoding("utf8");

module.exports = cb => {
  console.log("Enter MFA Code:");

  process.stdin.on("readable", () => {
    const chunk = process.stdin.read();
    if (chunk !== null) {
      cb(chunk.trim());
    }
  });

  process.stdin.on("end", () => {
    process.stdout.write("end");
  });
};
