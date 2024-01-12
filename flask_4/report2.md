# Python Flask #4 - updated - Meeting #4

1. secure_filename izmanto lai faila nosaukumā būtu tikai atļauti simboli, piemēram lai nebūtu kautkādi simboli, kuri varētu izveidot kādus bug sistēmā

2. salaboju lai attachment upload kods neatkārtotos:

   ![image-20240112040802050](https://s2.loli.net/2024/01/12/CRVWzbJQPGwfBDo.png)

3. pievienoju ka funkcija get_post_tags tagad atgriež vajadzīgos datus, salaboju lai return nebūtu izmētats pa funkciju:

   ![image-20240112042527531](https://s2.loli.net/2024/01/12/HwWsVOgC3xqF9jd.png)

4. izmantoju flask macro lai tiktu zīmēta tabula, kods isti nemainijās, tikai pārvietoju to uz macro.html un tad izmantoju no šī macro.html render_table_for_posts macro, kurā pievienoju vel thumbnail kolonnu, kura uzrāda pagaidām placeholder img, ja ir uuid:

   ![image-20240112051626870](https://s2.loli.net/2024/01/12/aH5m39UfvAXbwPe.png)

   ![image-20240112052728750](https://s2.loli.net/2024/01/12/GrIZBlO5CUaEKmA.png)