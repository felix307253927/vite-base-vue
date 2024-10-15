import { useMDHook } from "../src/components/AIDialog/mdHook";

const md = useMDHook();

const str = md(`这个是js代码、
\`\`\`javascript
       const b = 458;
     \`\`\`代码很简单$ latex code $

\` other code \` end`);

console.log(str);
