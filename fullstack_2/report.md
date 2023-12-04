# Meeting #1 - MD_2_2

#### Code correction

1.  Memory storage izdara tā lai uploaded fails paliek RAM nejau glabājas diskā, tas ir vajadzīgs jo uploaded fails nav liels un nav vajadzīgs pēc procesa.

2.  Noņēmu { } no species.

   ![image-20231204031326553](C:\Users\xnzza\AppData\Roaming\Typora\typora-user-images\image-20231204031326553.png)

3. Noņēmu nevajadzīgos ApiRequest(payload, filepath).

   ![image-20231204032313219](C:\Users\xnzza\AppData\Roaming\Typora\typora-user-images\image-20231204032313219.png)

4. Pievienoju null vertibu pie response.

   ![image-20231204032956075](C:\Users\xnzza\AppData\Roaming\Typora\typora-user-images\image-20231204032956075.png)

5. Izveidoju vienkārši funkcijas kuras vēlāk izsaucu.

   ![image-20231204041226392](C:\Users\xnzza\AppData\Roaming\Typora\typora-user-images\image-20231204041226392.png)

6. Funkciju createStatsResponse pārtaisiju lai tā būtu vieglāk saprotama, izmantojot funkcijas no 5.

   ![image-20231204041639149](C:\Users\xnzza\AppData\Roaming\Typora\typora-user-images\image-20231204041639149.png)

   