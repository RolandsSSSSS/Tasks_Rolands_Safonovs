# Meeting #1 - MD_2_2

#### Code correction

1.  Memory storage izdara tā lai uploaded fails paliek RAM nejau glabājas diskā, tas ir vajadzīgs jo uploaded fails nav liels un nav vajadzīgs pēc procesa.

2.  Noņēmu { } no species.

   ![image-20231204031326553](https://s2.loli.net/2023/12/06/9hOralYdByGERIW.png)

3. Noņēmu nevajadzīgos ApiRequest(payload, filepath).

   ![image-20231204032313219](https://s2.loli.net/2023/12/06/uLhv6XFwJUGjIV5.png)

4. Pievienoju null vertibu pie response.

   ![image-20231204032956075](https://s2.loli.net/2023/12/06/aDJRqFYXf98o2lS.png)

5. Izveidoju vienkārši funkcijas kuras vēlāk izsaucu.

   ![image-20231204041226392](https://s2.loli.net/2023/12/06/QoEJugLRrlbZF8D.png)

6. Funkciju createStatsResponse pārtaisiju lai tā būtu vieglāk saprotama, izmantojot funkcijas no 5.

   ![image-20231204041639149](https://s2.loli.net/2023/12/06/u5D2IecQx8TnCF7.png)

   