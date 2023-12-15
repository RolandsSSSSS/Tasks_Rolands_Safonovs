# Python Flask #3

Pārmainiju delete_post izmantojot UtilDatabaseCursor:

![image-20231215030607121](https://s2.loli.net/2023/12/15/wsdbtyMLOVX6zi2.png)

tāpat arī get_post:

![image-20231215030953680](https://s2.loli.net/2023/12/15/Ku2cvn1lZSpy6zB.png)

arī update_post: ![image-20231215031045349](https://s2.loli.net/2023/12/15/6wnBYDzNiUSRHfd.png)

arī inser_post:

![image-20231215031202561](https://s2.loli.net/2023/12/15/rROZ16uiwxDaFje.png)

un izdzēsu __connection jo to vairs nevajag:

![image-20231215031308086](https://s2.loli.net/2023/12/15/6SaeYOIhwur7zGs.png)

1.  Uzlaboju, main.scss, izveidoju base.html kur ir vienkārši base priekš visa(head, body, footer, header)

   tad izmantoju to main.html, view.html un edit.html, šeit kā izskatas pārtaisītais view.html:

   ![image-20231215060900838](https://s2.loli.net/2023/12/15/kAx7wvpJLK3mqUd.png)

2. Pievienoju index.html, un pievienoju controllerposts jaunu route index

   ![image-20231215075002514](https://s2.loli.net/2023/12/15/fVI8BjKbgE1SDnA.png)