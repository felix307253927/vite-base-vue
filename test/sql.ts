/*
 * @Author             : Felix
 * @Email              : 307253927@qq.com
 * @Date               : 2024-09-09 10:18:55
 * @LastEditors        : Felix
 * @LastEditTime       : 2024-09-09 10:24:50
 */
import { format } from "sql-formatter";

const sqlText = `WITH temp1 AS ( \t  SELECT DATE_FORMAT(opdate,'%m-%d') AS 日期, \t\t\t SUM(adult+child+infant+transitadult+transitchild+transitinfant) AS 今年五月旅客吞吐量 \t  FROM flights \t  WHERE DATE_FORMAT(opdate,'%Y-%m')=DATE_FORMAT(CURDATE(),'%Y-05') \t  GROUP BY opdate \t  ), \t\t temp2 AS ( \t  SELECT DATE_FORMAT(opdate,'%m-%d') AS 日期, \t\t\t SUM(adult+child+infant+transitadult+transitchild+transitinfant) AS 去年五月旅客吞吐量 \t  FROM flights \t  WHERE DATE_FORMAT(opdate,'%Y-%m')=DATE_FORMAT(CURDATE() - INTERVAL 1 YEAR,'%Y-05') \t  GROUP BY opdate \t  ), \t\t temp3 AS ( \t  SELECT DATE_FORMAT(opdate,'%m-%d') AS 日期, \t\t\t SUM(adult+child+infant+transitadult+transitchild+transitinfant) AS 2019年五月旅客吞吐量 \t  FROM flights \t  WHERE DATE_FORMAT(opdate,'%Y-%m')='2019-05' \t  GROUP BY opdate \t\t ) \tSELECT temp1.日期,temp1.今年五月旅客吞吐量,temp2.去年五月旅客吞吐量,temp3.2019年五月旅客吞吐量 \tFROM temp1 \tINNER JOIN temp2 ON temp2.日期 = temp1.日期 \tINNER JOIN temp3 ON temp3.日期 = temp1.日期 \tORDER BY temp1.日期;`;

console.log(format(sqlText, { language: "sql" }));
