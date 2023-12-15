# Python Flask #4

1. Pievienoju thumbnail_uuid visam funkcijām iekšā ControllerDatabase, piem:

   ![image-20231215090902069](https://s2.loli.net/2023/12/15/piXQRfcDIaAgVqM.png)

   tad edit.html pievienoju ka var update arī thumbnail_uuid, bet kad taisa new tad nevar ierakstīt:

   ![image-20231215091040619](https://s2.loli.net/2023/12/15/ejfwDMBUOZQqkPN.png)

   kā arī pieliku pie view lai varētu redzēt to: 

   ![image-20231215091139447](https://s2.loli.net/2023/12/15/UPnBELd59waQzF8.png)

   un tad pieliku to pie post_edit iekšā ControllerPosts, kur ja tiek veidots jauns post tad vienkārši tiek automātiski generēts uuid:

   ![image-20231215091359273](https://s2.loli.net/2023/12/15/IH6jOSEGBUlwaMD.png)

2. 