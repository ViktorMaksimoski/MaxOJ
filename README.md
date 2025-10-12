
### Што е MaxOJ?

  

MaxOJ е платформа на македонски јазик која има цел да го доближи натпреварувачкото програмирање до учениците и сите ентузијасти.

  
  

### Создавање и менување на лекции

  

Се што треба да направите е да создадете Pull Request. Лекциите ќе бидат

детално разгледани пред да се одлучи дали ќе се додадат!

  

Лекциите се во **.mdx** формат. За полесно уредување имам создадено свои

компоненти.

 ## SectionTitle
Ова е **Wrapper** компонента.
Секоја секција од лекцијата мора да започне со оваа компонента.
Пример употреба: `<SectionTitle>Вовед</SectionTitle>`

## SectionContent
Ова е **Wrapper** компонента.
Пожелно е текстуалната содржина од секоја секција да ја пишувате овде.
Пример употреба: 
```
<SectionContent>
Lorem  ipsum  dolor  sit  amet  consectetur  adipisicing  elit. Omnis cupiditate  sequi  facilis  cumque  
consequatur  provident  quod  error  minus  quas  
debitis,  eveniet  sint,  saepe  repudiandae  et  
praesentium  quidem. Est,  quisquam  facere!
</SectionContent>
```
## Tag
Ова е **Wrapper** компонента.
Пожелно е да ја користите за да обележите некои клучни зборови, во содржината на секцијата.
Пример употреба: `<Tag>Сегментно Дрво</Tag>`

## Info
Ова е **Wrapper** компонента.
Се користи за давање на совети.
Пример употреба: 
```tsx
<Info>Многу често може да користите Bitmask DP за 
решавање на подзадачи.</Info>
```
## Warning
Ова е **Wrapper** компонента.
Би се користело за важни имплементациски детали.
Пример употреба:
```tsx
<Warning>Секогаш поставувајте основен случај при пишување рекурзија!</Warning>
```
## Code
Ова е **Wrapper** компонента.
Сите кодови пишувајте ги овде. 
Подржува само **C++** кодови.
Дозволува копирање на кодот.
По **default** ги прикажува само првите 15 линии од кодот.

**За добро форматирање пишувајте ги сите кодови вака:**
```tsx
<Code>
{[
"#include <bits/stdc++.h>,
"using namespace std;",
"\nint main() {",
"\treturn 0;",
"}"
].join('\n')}
</Code>
```

## FocusProblem
Оваа компонента користи **props**:
**url** (задолжително): Линк до задачата
**source** (задолжително): Скратено име на сајтот
**task** (задолжително): Име на задачата
**level** (задолжително): Тежина на задачата од 1 до 4

Се користи за задавање на пример задача која ќе се обработува во секцијата.

```tsx
<FocusProblem url="https://mendo.mk"
source="MENDO" task="Паметен Град"
level={4} />
```
## TasksTable и TaskRow
**TasksTable** е **Wrapper** компонента.
Се користи за задавање на задачи за вежбање на крајот на секоја лекција.

**TaskRow** користи **props**:
**url** (задолжително): Линк до задачата
**source** (задолжително): Скратено име на сајтот
**task** (задолжително): Име на задачата
**level** (задолжително): Тежина на задачата од 1 до 4
**star** (по потреба): Поставете на **true** за препорачани задачи.

Пример употреба:
```tsx
<TasksTable>
	<TaskRow url="https://oj.uz/problem/view/JOI18_Tents"
	source="OJ.UZ" task="JOI SC - Tents" level={2} />
	<TaskRow url="https://mendo.mk" source="MENDO" 
	task="Паметен Град" level={4} star={true} />
</TasksTable>
```
## LinksTable и LinkRow
**LinksTable** е **Wrapper** компонента.
Се користи за прикачување на содржини за читање на почеток на секоја секција.

**LinkRow** користи **props**:
**url** (задолжително): Линк до задачата
**source** (задолжително): Скратено име на сајтот/книгата
**name** (задолжително): Име на материјалот
**importance** (задолжително): Важност на ресурсот

Пример употреба:
```tsx
<LinksTable>
	<LinkRow url="https://usaco.guide/CPH.pdf#page=112"
	source="CPH" name="НРС, Броење" importance={3} />
	<LinkRow url="https://www.youtube.com/watch?
	v=YBSt1jYwVfU&t=45s" source="YouTube"
	name="Errihcto - Вовед во DP" importance={4} />
</LinksTable>
```
