# MD_7_2

1. Pievienoju lai varētu dzest habit, pievienoju pie props onHabitDelete kur padod habitid ka number:

   ![image-20240119142641895](https://s2.loli.net/2024/01/19/InWCViAYt1s59Zw.png)

2. tad aizpildīju onDeletePress, lai padodu ka tiek dzešana uz noteikto id:

   ![image-20240119142851905](https://s2.loli.net/2024/01/19/toPMBmyIpec6g4n.png)

3. tad ScreenHabits izveidoju jaunu const onHabitDelete, kur tiek izmantotota filtrācija, kur newHabits paliek tikai tie habit kuriem nav id vienāds ar dzēšamo habit id un tad vienkarsi tiek saglabati jaunie habit:

   ![image-20240119143413375](https://s2.loli.net/2024/01/19/CxUfwD9pFKvYRXB.png)

4. un tad return pievienoju onHabitsDelete:

   ![image-20240119143623580](https://s2.loli.net/2024/01/19/sNYftXworUP8BLD.png)

5. pievienoju lai varētu redzēt un ievadīt number_of_times_in_week ar InputText, sākumā izveidoju useState:

   ![image-20240119150910885](https://s2.loli.net/2024/01/19/1cWQNJpvdjxn42q.png)

6. tad pievienoju number_of_times_in_week pie onSaveHabit:

   ![image-20240119151106060](https://s2.loli.net/2024/01/19/TjGSMOazgVeIsm7.png)

7. un tad returna pievienoju kad notiek editošana, tad ir iespeja mainit number_of_times_in_week, kur limits ir no 1 līdz 10, kad nav editošana tad vienkārši parāda šo number_of_times_in_week kā text:

8. ![image-20240119151734997](https://s2.loli.net/2024/01/19/LqQat7wNKRzTPke.png)