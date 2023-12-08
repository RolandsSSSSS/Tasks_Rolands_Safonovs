# Python Flask #2

1. Pievienoju main lai uzraditu Post updated kad linka ir edited

   ![image-20231208020050545](https://s2.loli.net/2023/12/08/mQg2IFWCvjVhLYa.png)

2. Salaboju insert mazu kļūdu, ka body tika ievietots title vietā un title tika ievietots body vieta

   ![image-20231208025843268](https://s2.loli.net/2023/12/08/btvBmF5kMH6EjTK.png)

   Pievienoju get_all_posts, kur vienkārši paņem visus posts ar tā visiem ierakstiem

   ![image-20231208030145900](https://s2.loli.net/2023/12/08/jlsbxYMit6VWyLn.png)

   un tad main pievienoju ka paņem visus šos post ar get_all_post un return

   ![image-20231208030435028](https://s2.loli.net/2023/12/08/LViZjXYnEbQt3lc.png)

   un home.html pievienoju table(kurā ir title, laiks kad edited un href edit) un style

   ![image-20231208033132622](https://s2.loli.net/2023/12/08/dfgsDKLWSmzIVb8.png)

   nomainiju view.html pogu Edit uz href tapat kā main tabulā

   ![image-20231208053254307](https://s2.loli.net/2023/12/08/9DUoIPJnFSdQZfE.png)

3. pieliku modified pie update lai būtu CURRENT_TIMESTAMP

   ![image-20231208052623067](https://s2.loli.net/2023/12/08/PtDQEhbpL28NVJB.png)

   tad pievienoju ka post_edit paņem post_id, izveido post tukšu, pārbauda ja post_id nav null tad post ievieto šo post ar id, nomainiju /?delete lai atgriež post_id, pievienoju if button_type == edit, kur izsauc update_post(post), un redirecto uz /?edited=url_slug un beigu return(edit) pieliku post_id un post

   ![image-20231208054510791](https://s2.loli.net/2023/12/08/bOLkg7Azfr4QjKy.png)

   un izmainiju edit.html pieliku if{}else{}, ja post.post_id nav tukš tad izmanto update vajadzīgo(nomaina header uz Update Post, Save uz Update un visiem laukiem jau iedod izvelētā post values, button_type = edit), bet ja post.post_id ir tukšs tad vienkārši izmanto visu zem else, kur ir iepriekšējais html kods

   ![image-20231208055417948](https://s2.loli.net/2023/12/08/38sfgVeSLEIotGp.png)