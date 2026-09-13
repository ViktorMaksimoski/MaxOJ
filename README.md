
### Што е MaxOJ?

MaxOJ е платформа на македонски јазик која има цел да го доближи натпреварувачкото програмирање до учениците и сите ентузијасти.

## За фронтенд: 

```
cd frontend
npm run dev
```

### Создавање и менување на лекции

Се што треба да направите е да создадете Pull Request. 

Лекциите ќе бидат детално разгледани пред да се одлучи дали ќе се додадат!

Лекциите се во **.mdx** формат. 

За полесно уредување имам создадено свои компоненти.

### Компоненти за лекции

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
"#include <bits/stdc++.h>",
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

## Spoiler

Ова е **Wrapper** компонента што користи **props**:

**title** (задолжително): Наслов

Се користи за задавање на хинтови

Пример употреба

```tsx
<Spoiler title="Hint 1">
	Овој hint е од голема помош.
</Spoiler>
```

### Компоненти за задачи

## Глава на задача

Секој задача треба да започне вака

```tsx
<TaskHead>
    <Title>Minor Subarrays</Title>
    <Metadata timeL={1} memoryL={256}/>
</TaskHead>
```

Мислам дека ова кодче е себеобјаснувачко

## Текст на задача

Го пишувате во 

```tsx
<TaskBody>

</TaskBody>
```

## Подзадачи

```tsx

<TaskSubtasks depend={true}>
    <Subtask id={1} points={10} dep="/">$N \leq 2000$</Subtask>
    <Subtask id={2} points={10} dep="/">$A_i = B_i$ and $0 \le A_i \le 1$</Subtask>
    <Subtask id={3} points={10} dep="/">$B_i = 1$ and $0 \le A_i \le 20$</Subtask>
    <Subtask id={4} points={15} dep="3">$B_i = 1$</Subtask>
    <Subtask id={5} points={10} dep="/">$A_i = 1$ and $B_i$ are powers of $2$</Subtask>
    <Subtask id={6} points={25} dep="5">$A_i = 1$</Subtask>
    <Subtask id={7} points={20} dep={'1 - 6'}>Original constraints</Subtask>
</TaskSubtasks>
```

**id** и **points** се секогаш задолжителни. 

Во случај задачата да користи зависности, може да ги запишете со поставување
на **depend** на **true** и потоа во секоја подзачада преку **dep** ги запишувате

## Секции

Може да се користат за да се опишта влезот, излезот или за објаснување на примери.

```tsx
<Section title="Излез">
    // Tekst ovde
</Section>
```

## Примери

```tsx

<TaskSamples>
    <Sample>
        <pre>
            2 4
        </pre>
        <pre>
            8
        </pre>
    </Sample>
</TaskSamples>
```

Секој **Sample** мора да биде опфатен во **TaskSamples**.
За секој пример влезот е опфатен во 1то **pre**, а излезот во 2то.

## Информации/Предупредување

Се користи пред текстот на задачата за да извести натпреварувачот за
некои нестандардни специфики на задачата (Пример. мал мемориски лимит)

```tsx
<Info>
	//tekst ovde
</Info>
```

## Image

Оваа компонента користи **props**

**id** (задолжително): Патот на сликата во **Backblaze**, формат е **idNaZadaca/idNaSlika**

**txt**: Дополнителн текст кој стои под сликата како обасјнување

### Создавање на лекција

Прво, во `frontend/public/data/lections/tema.json` додадете метадата за лекцијата.

Потоа, во `content/tema/kod_na_lekcija.json` додадете основни податоци.

Во `markdown/tema/kod_na_lekcija.md` Пишувајте ја лекцијата користејќи ги готовите компоненти.

### Создавање натпревар

Во `frontend/public/data/tasks/types.json` додадете го натпреварот во соодветната година.

Во `/competitions` создадете file `ime.godina.json`. Тука ставете име на натпреварот и наслови на задачите.

### Создавање на задача

Во `/src/markdown/godina/ime/` создадете `broj_na_zadaca.md` file.

Пишувајте го текстот тука.

## Додавање слика

Се користи `Image` компонента. Пред да се користи сликата мора истата

да биде додадена во Backblaze во папката **images/idNaZadaca**

## Создавање тестови

Во `backend/generator/main.cpp` се куца генераторот и се компајлира во `a.out`

Точното решение се става во `generator/sol.cpp` и се компајлира во `sol`

## Додавање checker

Ако задачата може да има повеќе валидни конструкции/одговори може да се искуца checker. Во `checker.cpp` има инструкции како да се куца.

## Уплоадирање на задачата до базите на податоци

Се повикува `backend/addProblem.js`, забележете дека вкупниот број поени мора да е `100`