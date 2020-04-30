import chalk from 'chalk';

import logo from '../../../tools/logo';

const expectedLogo = chalk.magenta.bold(`
                  :ooooooooooooooooooooo:\`               \`.:++++++++++++++++++++++++++//:-.\`        
                -ooooooooooooooooooo/.                      -/ooooooooooooooooooooooooooooo+:.      
               .ooooooooooooooooooo\`                          .+oooooooooooooooooooooooooooooo+-    
              \`oooooooooooooooooooo/                           \`+ooooooooooooooooooooooooooooooo+\`  
             \`+ooooooooooooooooooooo/     ${chalk.yellow('`.-:///:-`-/-')}         \`ooooooooooooooooooooooooooooooooo\` 
             +oooooooooooooooooo+////\`  ${chalk.yellow('`-/oooooooooo+.`')}          :ooooooooooo:.....-:+oooooooooooo:
            /ooooooooooooooo/-.\`\`....${chalk.yellow('-+ooooo+-.-oooo+')}            .ooooooooooo-        :oooooooooooo 
           :ooooooooooooooo+ ${chalk.yellow('`/+oooooooooooo-   /ooo:')}            -ooooooooooo-         oooooooooooo 
          -ooooooooooooooooo\` ${chalk.yellow('-/ooooooooooooo+/+ooo/')}             /ooooooooooo-        .ooooooooooo+ 
         -ooooooooooooooooooo:  ${chalk.yellow('+oooooooooooooooo+-')}             .oooooooooooo-    \`\`.:oooooooooooo- 
        .oooooooooooooooooooo. ${chalk.yellow(':ooooooooooooooo+-`')}             \`+ooooooooooooo+++++oooooooooooooo:  
       \`ooooooooooooooooooooo\`${chalk.yellow('`.ooooooooooooo:.')}               -oooooooooooooooooooooooooooooooo+-   
      \`+oooooooooooooooooooo${chalk.yellow('--o:`/oooooooooo-')}               \`/ooooooooooooooooooooooooooooooo+-\`    
      /oooooooooooooooo/..${chalk.yellow('-o/.//- .-...oooo:')}              \`/oooooooooooooooooooooooooooooo+-\`       
     /ooooooooooooooooo:\`  ${chalk.yellow('`+o//++///- -++-')}            \`-/ooooooooooooooooooooooooooooooooo-        
    :ooooooooooooooooo:${chalk.yellow('`....+')}ooooooooo:.\`\`.         \`-/ooooooooooooooooooooooooooooooooooooo/\`      
   -ooooooooooooooooooooooooooooooooooooooo/      ./ooooooooooooooooooooooooooooooooooooooooo+.     
  .oooooooooooo................-oooooooooooo:    .---------------:ooooooooooo:..../oooooooooooo:    
 \`oooooooooooo-                 -oooooooooooo-                   .ooooooooooo-     -oooooooooooo+\`  
\`+ooooooooooo:                   :oooooooooooo.                  .ooooooooooo-      .ooooooooooooo- 
+ooooooooooo/                     /oooooooooooo\`                 .ooooooooooo-       \`+oooooooooooo/`);

/**
 * Logo should be displayed as expected
 */
test('Logo is displayed as expected', (): void => {
  expect(logo).toEqual(expectedLogo);
});