# Python Flask #4

1. Pievienoju databaseController  insert_post, update_post, get_post pie sql funkcijas thumbnail_uuid, piemērs insert_post:

   ![image-20231228151838763](https://s2.loli.net/2023/12/28/4LxtSDMTWjG7PpK.png)

   tad pievienoju lai varētu to pievienot edit.html, ja tiek izmantots update tad var editot šo uuid, bet ja tiek veidots new, tad tas tiek izveidots automātiski:

   ![image-20231228152115979](https://s2.loli.net/2023/12/28/N1jTdkRHQPVyvcb.png)

   un tad pievienoju to Controllerpost zem post_edit, kur ir request un tad if ir pārbaude ja tiek veidots jauns post tad tiek izveidots jauns uuid:

   ![image-20231228152413407](https://s2.loli.net/2023/12/28/eMntBRv5WHSVi7f.png)

2. Izveidoju jaunu table attachments:

   ![image-20231228152643368](https://s2.loli.net/2023/12/28/S5z8B9bGYZPwvFD.png)

   izveidoju ModelAttachment, kur tiek izveidots relationship ar ModelPost:

   ![image-20231228152756209](https://s2.loli.net/2023/12/28/Z7TjvWDb5un4pUt.png)

   ![image-20231228152844823](https://s2.loli.net/2023/12/28/hzJPAnUk7Trxv3w.png)

3. databaseController izveidoju 4 funkcijas(insert, upload, get, delete) :

   ![image-20231228153014762](https://s2.loli.net/2023/12/28/roxMJLkVESwls5Y.png)

   ![image-20231228153046386](https://s2.loli.net/2023/12/28/RYJpgn16d2XvLc5.png)

4. Pievienoju post_edit lai tiktu izveidots fails iekšā fails mapē, ja tas vel nav, un tad ja tiek veidots jauns post tad vienkārši inserto to, ja tiek editots, tad  pārbauda vai jau ir fails pievienots šim post un ja ir tad aizvieto ar update funkciju, ja jau ir tad vienkārši inserto:

   ![image-20231228155340029](https://s2.loli.net/2023/12/28/9h58XzBy3tx1mNZ.png)

5. Un tad pievienoju edit.html lai būtu iespējams pievienot pdf failu:

   ![image-20231228153951965](https://s2.loli.net/2023/12/28/3g4zvYZAsN61CDk.png)