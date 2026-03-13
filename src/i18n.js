import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        translation: {
            "VIEWS": {
                "HOME": 'Home',
                "PROJECTS": 'Projects',
                "PLANNER": 'Planner',
                "CALC": 'Wire/Load Calculator',
                "SETTINGS": 'Settings',
                "ELEMENT": 'Element Details',
            },
            "SETTINGS": {
                "LANG": 'Language',
                "ORPHANS": 'There are items assigned to projects that no longer exist. These include:',
                'CURRENT_DB_VERSION': 'Migration version: {{dbVersion}}',
                'RESET_MIGRATIONS': 'Reset migrations',
                'MIGRATIONS': 'Database migrations',
            },
            "TITLES": {
                "WIRE": 'Wire settings',
                "LOAD": 'Load settings',
                "CONFIRM": 'Confirmation',
                "CREATE_PROJECT": 'Create project',
                "EDIT_PROJECT": 'Edit project',
                "CREATE_ELEMENT_MODAL": 'Choose element type',
                "VOLTAGE_DROP": 'Voltage drop',
                "SHORT_IMPEDANCE": 'Short impedance',
                "OVERCURRENT": "Overcurrent Protection settings",
                "TERMINAL": "Connection configuration",
                "POWER_LOSS": 'Power Loss [W]',
                "RCD": 'RCD configuration',
                'SHORT_CURRENT': 'Short current',
                'PROJECT_WIRE_MODAL': 'Editing a project line',
                "GENERAL_INFO": 'General info',
                "LOAD_CALC": "Load calculator",
                "LOAD_CALC_SUBHEADER": "Test load and wire match",
                "PROJECTS_SUBHEADER": "Manage your projects here",
            },
            "WIRE": {
                "PLACEMENT": "Placement",
                "PLACEMENTS": {
                    "UNDER_PLASTER": "Under plaster",
                    "IN_PIPE_ON_WALL": "In pipe on wall",
                    "DIRECT_ON_WALL": "Directly on wall",
                },
                "TYPE": "Wire Type",
                "TYPES": {
                    "ONE_WIRE": "One wire",
                    "MULTI_WIRE": "Multi wire"
                },
                "TYPE_INFO": "One-wire - most often of the DY type, having only one layer of insulation and one conductor. Multi-wire - most often of the YDY type, i.e. having 2 layers of insulation grouped with 2 or more wires.",
                "PHASE": "Phase",
                "PHASES": {
                    "ONE": "Single Phase",
                    "THREE": "Three Phase"
                },
                "DIAMETER": 'Diameter [mm\u00B2]',
                "LENGTH": "Length [m]",
                "LENGTH_INFO": "The length of the cable affects the voltage drop, the rule will be recalculated after saving the edited element.",
                "MAX_CAPACITY": "Max Capacity [A]",
                "MAX_CAPACITY_INFO": "Maximum load capacity calculated based on the load capacity table and cable parameters.",
                "VOLTAGE_DROP_INF0": 'The voltage drop resulting from this wire equals {{ownVoltageDrop}}[%]. The voltage drop caused by the previous elements equals {{parentVoltageDrop}}[%]. Allowed maximum drop from the start of the network to the final receiver should not exceed 3%.',
                "SHORT_IMPEDANCE_INF0": 'The impedance resulting from this wire is {{ownImpedance}}[\u2126]. The impedance due to the previous elements is {{parentImpedance}}[\u2126]. Total wire impedance = {{totalImpedance}}[\u2126].\n\nThe short-circuit impedance in this application corresponds to the wire resistance at a temperature of ~80\u00b0C, calculated twice (phase + return wire paths).',
                "POWER_LOSS_INF0": 'Power losses dissipated on the cable. The power supply must provide the power of the target load as well as the power lost in the form of heat on the wire. To limit this power, the power factor should equal 1 (purely resistive load).'
            },
            "LOAD": {
                "DRAW_POWER": "Draw Power [W]",
                "POWER_FACTOR": "Power Factor",
                "POWER_FACTOR_INFO": "Power factor, expressed as cos(\u0394), where \u0394 - is the difference in the phase angles of the current and voltage signals. For purely resistive loads \u0394 = 0\u00b0 (coefficient = 1), for more or less reactive loads Δ = \u00b190\u00b0 (0<= coefficient < 1).",
                "PHASE_CURRENT": "Phase current [A]",
                "PHASE_CURRENT_INFO": "Phase current flowing between phases (delta connection).",
                "LINE_CURRENT": "Line current [A]",
                "LINE_CURRENT_INFO": "Line current flowing in wire of device/load (star connection).",
                "CONFIG": "Connection configuration",
                "IS_HIGH_CURRENT": "High starting current?",
                "IS_ZEROED": "Is zeroed?"
            },
            "OVERCURRENT": {
                "CLASS": "Class",
                "AMPERAGE": "Nominal current [A]",
                "FIRE_CURRENT": "Fire current [A]",
                "FIRE_CURRENT_INFO": "The current at which we are guaranteed to trip overcurrent protection. Its nominal amperage can be 16A. However, with this value off it won't trigger immediately. Thermal tripping will occur after some time, and short-circuit tripping (high instantaneous currents) will occur immediately.\n\nThis current corresponds to the loop short-circuit current and is used to calculate the self-turn-off rule.",
                "SHORT_CURRENT_INFO1": 'The short-circuit current equals {{shortCurrent}}[A] and the fire current of the nearest circuit breaker equals {{opFireCurrent}}[A]. To prevent damage to the wire, the fire current must be less than the wire short-circuit current.',
                "SHORT_CURRENT_INFO2": 'The short-circuit current equals {{shortCurrent}}[A]. Element is not secured from overcurrent, which may damage element/wire.',
            },
            "TERMINAL": {
                "TYPE": 'Network type',
                "SET_DEFAULT": "Set the default wire values ​​so that the impedance is ~0.6\u2126. All cable settings will remain unchanged. Only the length will be selected so that the resulting impedance is appropriate."
            },
            "RCD": {
                "NOMINAL_CURRENT": 'Nominal current [A]',
                "DIFF_CURRENT": 'Differential current [mA]',
            },
            "ELECTRIC_ELEMENT": {
                "BASIC": 'Basic',
                "LOAD": 'Load',
                'LOAD_LIGHT': 'Light',
                'LOAD_SOCKET': 'Socket 1.5kW',
                'LOAD_OVEN': 'Oven 2.5kW',
                'LOAD_WASHING_MACHINE': 'Washing machine 2kW',
                "OVERCURRENT": 'Overcurrent Protection',
                "OVERCURRENT_LIGHT": 'Typical B10A for light',
                "OVERCURRENT_SOCKET": 'Typical B16A for socket',
                "TERMINAL": 'Connection',
                "RCD": 'RCD',
            },
            "ERROR": {
                "WRONG_WIRE_DIAMETER": "Selected wire is wrong, max capacity < phase current, (use: {{matchingDiameter}})",
                "TOO_BIG_VOLTAGE_DROP_PREV": "Voltage drop on the cable too high ({{parentVoltageDrop}} [%]). The drop of the previous element should be reduced.",
                "TOO_BIG_VOLTAGE_DROP_THIS": "Voltage drop on the cable too high ({{ownVoltageDrop}} [%]). Increase the cable cross-section (at least {{matchingDiameter}}) or reduce the receiver power or cable length (max. {{maxLength}}m).",
                "SELF_TURN_OFF": "The self-turn-off rule is not met, use a shorter cable (max. {{maxLength}}m) or increase the cable cross-section (min. {{minDiameter}}mm\u00B2) or change the parameters of the overcurrent protection ({{closestOpName}})",
                "WRONG_OVERCURRENT_PROTECTION": "Nominal current of overcurrent protection must be in the range [{{lower}}, {{upper}}] [A].",
                "NO_ZEROING_TNC": "The TN-C type connection requires zeroing",
                "NO_ZEROING_OTHER": "The {{type}} connection does not tolerate zeroing",
                'RCD_TOTAL_CURRENT': 'A current greater than the nominal current may flow through the RCD (use: {{minNominationCurrent}}[A])',
                'NO_MATCHING_RCD': 'RCD nominal current is still too low. It is necessary to divide the RCD into several and distribute all loads between them.',
                'DESCENDING_CAPACITY': 'Current load capacity of the wire is lower than that of the child element(s). It should be limited for children or increased on this element (for example, use the cross-section: {{minDiameter}}mm\u00B2).',
                'RCD_TNC': 'RCD cannot be used in a network with a TN-C connection. It may not function properly.',
            },
            "WARN": {
                "START_CURRENT_ISSUE": 'The high starting current can reach up to {{maxStartCurrent}}[A]. MCB will fire at the value {{opFireCurrent}}[A]. Increase the circuit breaker class or reduce the load power (max: {{maxPower}}[W]).',
            },
            "INFO": {
                "TOO_BIG_WIRE_DIAMETER": "Wire could be smaller, (use: {{matchingDiameter}})",
                "OVERCURRENT_SPLIT_POSSIBLE": "There are non-overlapping current ranges {{rangeListString}}, loads must be distributed among several circuit breakers.",
                "NO_MATCHING_OP": "Overcurrent protection does not have a value that meets the required range in current series. The cable cross-section should be increased or the power consumption should be reduced, thus changing the protection boundaries."
            },
            "QUESTIONS": {
                "SINGLE_ELEMENT_DELETE": 'Are you sure you want to delete this element?',
                "MULTI_ELEMENT_DELETE": 'This element has {{childrenCount}} more connected elements! Are you sure you want to delete them all?',
                "DELETE_PROJECT": 'Do you want to delete project: {{projectName}}?',
                "UNSAVED_CHANGES": 'There are unsaved changed? Are you sure you want to go back and lose them?',
                "DELETE_ORPHANS": 'Are you sure you want to delete all items assigned to non-existent projects?',
                'RESET_MIGRATIONS': 'Are you sure you want to reset database migrations? All data will be lost!',
                "DELETE_MULTI_PROJECT": 'Are you sure you want to delete {{count}} project(s)?',
            },
            "COMMON": {
                "LOADING": 'Loading...',
                "YES": 'Yes',
                "NO": 'No',
                "DONE": 'Done',
                "SELECT": 'Select',
                "NAME": 'Name',
                "OWNER": 'Owner',
                "ELEMENT_COUNT": 'Element count',
                "EDIT_TYPE_INFO": 'You are changing the type of an existing element. Common parameters for both types will be copied, the rest will be set to default values. The current values ​​of old-type element will be lost forever!',
                "OP_CURRENT_OUT_OF_SERIES": 'The current nominal current is not available in series for class {{class}}',
                "SET_DEFAULT": 'Set defaults',
                'PROJECT_WIRE_INFO': 'Set the wire parameters that will be selected by default when adding any element in this project.',
                'SWITCHBOARD_SETTINGS': 'Tune to the switchgear',
                'PREDEFINED_WIRE_INFO': 'The wire defined for the project is different from the one assigned to the currently selected element type. The latter has a higher priority and will be used. Uncheck the option if you want to use the project wire.',
                'PROJECT_WIRE_TITLE': 'Project wire: ',
                'EDITED_ELEMENT_WIRE_TITLE': 'Element wire: ',
                'PREDEFINED_WIRE_TITLE': 'Pre-defined wire: ',
                "SELECT_LIGHT_POWER_TITLE": 'Light-based power selector',
                "LIGHT_POWER_SELECTOR": 'Select lighting power depending on room parameters and type of light.',
                "ROOM_TYPE": "Room Type",
                "ROOMS": {
                    "RESIDENTIAL": "Residential",
                    "CORRIDOR_OR_UTILITY": "Corridor or utility"
                },
                "LIGHT_KIND": "Type of light",
                "LIGHT_KINDS": {
                    "CLASSIC_BULB": "Classic bulb",
                    "LINEAR_FLUORESCENT_LAMP": "Linear fluorescent lamp",
                    "INDUCTION_LAMP": "Induction lamp",
                    "COMPACT_FLUORESCENT_LAMP": "Compact fluorescent lamp",
                    "LED": "LED lamp"
                },
                "LIGHT_EFFICIENCY": "Luminous efficiency [lm/W]",
                "ROOM_AREA": "Room area [m²]",
                "REQUIRED_LOAD_POWER": "Required power [W]",
                "EDIT": "Edit",
                "GO_TO_PLANNER": "Go to planner",
                "DELETE": "Delete",
                "CANCEL": "Cancel",
                "LIGHT_EFFICIENCY_TOOLTIP":"Luminous efficiency of the light source. Each kind of light source has some possible range of this efficiency, but your concrete light sources may have some custom value from that range, so set it here. If you don't have specific value, just press Avg button to set average value from correct range.",
                "SET_AVG": "Set Avg",
            },
            "VALIDATION": {
                'OUT_OF_RANGE': 'Outside range [{{min}}, {{max}}]',
                'GREATER_THAN': 'Number must be greater than or equal to {{value}}',
            },
            "PROJECTS_COL": {
                "PROJECT_NAME": "Project name",
                "ELEMENT_COUNT": "Element count",
                "OWNER": "Owner",
                "MODIFIED_BY": "Modified by",
                "LAST_MODIFIED_AT": "Last modified at",
                "ACTIONS": "Actions"
            },
        }
    },
    pl: {
        translation: {
            "VIEWS": {
                "HOME": 'Start',
                "PROJECTS": 'Projekty',
                "PLANNER": 'Planer',
                "CALC": 'Kalkulator Przewód/Obciążenie',
                "SETTINGS": 'Ustawienia',
                "ELEMENT": 'Szczegóły elementu',
            },
            "SETTINGS": {
                "LANG": 'Język',
                "ORPHANS": 'Istnieją elementy przypisane do już nie istniejących projektów. Należą do nich: ',
                'CURRENT_DB_VERSION': 'Wersja migracji: {{dbVersion}}',
                'RESET_MIGRATIONS': 'Resetuj migracje',
                'MIGRATIONS': 'Migracje bazodanowe',
            },
            "TITLES": {
                "WIRE": 'Konfiguracja przewodu',
                "LOAD": 'Konfiguracja obciążenia',
                "CONFIRM": 'Potwierdzenie',
                "CREATE_PROJECT": 'Tworzenie projektu',
                "EDIT_PROJECT": 'Edycja projektu',
                "GENERAL_INFO": 'Ogólne',
                "CREATE_ELEMENT_MODAL": 'Wybierz typ elementu',
                "VOLTAGE_DROP": 'Spadek napięcia',
                "SHORT_IMPEDANCE": 'Impedancja zwarcia',
                "OVERCURRENT": "Konfiguracja wył. nadprądowego",
                "TERMINAL": "Konfiguracja przyłącza",
                "POWER_LOSS": 'Moc strat [W]',
                "RCD": 'Konfiguracja wył. różnicowo-prądowego',
                'SHORT_CURRENT': 'Prąd zwarciowy',
                'PROJECT_WIRE_MODAL': 'Edycja przewodu projektowego',
                "LOAD_CALC": "Kalkulator obciążenia",
                "LOAD_CALC_SUBHEADER": "Test dopasowania obciążenia i przewodu",
                "PROJECTS_SUBHEADER": "Zarządzaj swoimi projektami tutaj",
            },
            "WIRE": {
                "PLACEMENT": "Miejsce montażu",
                "PLACEMENTS": {
                    "UNDER_PLASTER": "Pod tynkiem",
                    "IN_PIPE_ON_WALL": "W korytku na ścianie",
                    "DIRECT_ON_WALL": "Bezpośrednio na ścianie",
                },
                "TYPE": "Rodzaj przewodu",
                "TYPES": {
                    "ONE_WIRE": "Jednożyłowy",
                    "MULTI_WIRE": "Wielożyłowy"
                },
                "TYPE_INFO": "Jednożyłowe - najczęściej typu DY, posiadajace tylko jedną warstwę izolacji i jedną żyłę. Wielożyłowe - najczęściej typu YDY, czyli posiadające 2 warstwy izolacji grupowane po 2 lub więcej żył.",
                "PHASE": "Faza",
                "PHASES": {
                    "ONE": "Jednofazowy",
                    "THREE": "Trzyfazowy"
                },
                "DIAMETER": 'Przekrój [mm\u00B2]',
                "LENGTH": "Długość [m]",
                "LENGTH_INFO": "Długość przewodu wpływa na spadek napięcia, reguła zostanie przeliczona ponownie po zapisaniu edytowanego elementu",
                "MAX_CAPACITY": "Max Wytrzymałość [A]",
                "MAX_CAPACITY_INFO": "Maksymalna obciążalność wyliczona na podstawie tablicy obciażalności oraz parametrów przewodu.",
                "VOLTAGE_DROP_INF0": 'Spadek napięcia wynikający z tego przewodu jest równy {{ownVoltageDrop}}[%]. Spadek napięcia wywołany elementami poprzednimi wynosi {{parentVoltageDrop}}[%]. Dopuszczaly maksymalny spadek od początku sieci do końcowego odbiornika nie może przekraczać 3%.',
                "SHORT_IMPEDANCE_INF0": 'Impedancja zwarcia wynikająca z tego przewodu jest równa {{ownImpedance}}[\u2126]. Impedancja zwarcia wywołana elementami poprzednimi wynosi {{parentImpedance}}[\u2126]. Całkowita impedancja zwarcia przewodu = {{totalImpedance}}[\u2126].\n\nImpedancja zwarcia w tej aplikacji odpowiada rezystancji przewodu w temperaturze ~80\u00b0C liczona 2-krotnie (przewód fazowy + powrotny neutralny).',
                "POWER_LOSS_INF0": 'Moc strat wydzielana na przewodzie. Moc zasilania musi dostarczyć moc docelowego obciążenia jak i moc traconą w postaci ciepła na przewodzie. Aby ograniczyć tą moc współczynnik mocy powinien równać się 1 (obciążenie czysto rezystancyjne).'
            },
            "LOAD": {
                "DRAW_POWER": "Moc poboru [W]",
                "POWER_FACTOR": "Współczynnik mocy",
                "POWER_FACTOR_INFO": "Współczynnik mocy, wyrażony jako cos(\u0394), gdzie \u0394 - to różnica kątków fazowych sygnału prądowego oraz napięciowego. Dla obciażeń czysto rezystancyjnych \u0394 = 0\u00b0 (wsp = 1), dla obciążeń mniej lub bardziej reaktancyjnych Δ = \u00b190\u00b0 (0<= wsp < 1).",
                "PHASE_CURRENT": "Prąd fazowy [A]",
                "PHASE_CURRENT_INFO": "Prąd fazowy płynący między fazami (połączenie trójkąt)",
                "LINE_CURRENT": "Prąd liniowy [A]",
                "LINE_CURRENT_INFO": "Prąd liniowy płynący w każdej żyle urządzenia (połączenie gwiazda)",
                "CONFIG": "Połączenie",
                "IS_HIGH_CURRENT": "Wysoki prąd rozruchowy?",
                "IS_ZEROED": "Zerowanie?"
            },
            "OVERCURRENT": {
                "CLASS": "Klasa",
                "AMPERAGE": "Prąd nominalny [A]",
                "FIRE_CURRENT": "Prąd pewnego wyzwolenia [A]",
                "FIRE_CURRENT_INFO": "Prąd przy którym mamy gwarancję zadziałania wył. nadprądowego. Jego nominalny amperaż może wynosić 16A. Jednakże przy takiej wartości wył. nie wyzwoli się natychmiast. Termiczne wyzwolenie nastąpi po pewnym czasie, zaś zwarciowe (wysokie chwilowe prądy) natychmiast.\n\nTen prąd odpowiada prądowi zwarcia pętli i jest używany przy wyliczaniu reguły SWZ.",
                "SHORT_CURRENT_INFO1": 'Prąd zwarciowy wynosi {{shortCurrent}}[A], a prąd zadziałania najbliższego wył. nadprądowego {{opFireCurrent}}[A]. Aby przewód nie został uszkodzony prąd zadziałania wył. musi być mniejszy niż prąd zwarcia przewodu.',
                "SHORT_CURRENT_INFO2": 'Prąd zwarciowy wynosi {{shortCurrent}}[A]. Element nie jest zabezpieczony wył. nadprądowym co grozi uszkodzeniem przewodu.',
            },
            "TERMINAL": {
                "TYPE": 'Typ sieci',
                "SET_DEFAULT": "Ustaw domyślne wartości przyłącza tak by impedancja wynosiła ~0.6\u2126. Wszystkie ustawienia przewodu pozostaną niezmienione. Jedynie długość zostanie dobrana tak, by wynikowa impedancja była odpowiednia."
            },
            "RCD": {
                "NOMINAL_CURRENT": 'Prąd nominalny [A]',
                "DIFF_CURRENT": 'Prąd różnicowy [mA]',
            },
            "ELECTRIC_ELEMENT": {
                "BASIC": 'Ogólny',
                "LOAD": 'Obciążenie',
                'LOAD_LIGHT': 'Oświetlenie',
                'LOAD_SOCKET': 'Gniazdko 1.5kW',
                'LOAD_OVEN': 'Kuchenka 2.5kW',
                'LOAD_WASHING_MACHINE': 'Pralka 2kW',
                "OVERCURRENT": 'Wył. nadprądowy',
                "OVERCURRENT_LIGHT": 'Typowy oświetleniowy B10A',
                "OVERCURRENT_SOCKET": 'Typowy gniazdkowy B16A',
                "TERMINAL": 'Przyłącze',
                "RCD": 'Wył. różnicowo-prądowy',
            },
            "ERROR": {
                "WRONG_WIRE_DIAMETER": "Wybrany przewód jest zły, max wytrzymałość < prąd fazowy, (użyj: {{matchingDiameter}})",
                "TOO_BIG_VOLTAGE_DROP_PREV": "Spadek napięcia na przewodzie zbyt wysoki ({{parentVoltageDrop}} [%]). Należy zmniejszyć spadek poprzedniego elementu.",
                "TOO_BIG_VOLTAGE_DROP_THIS": "Spadek napięcia na przewodzie zbyt wysoki ({{ownVoltageDrop}} [%]). Zwiększ przekrój przewodu (min. {{matchingDiameter}}) lub zmniejsz moc odbiornika albo długość przewodu (max. {{maxLength}}m).",
                "SELF_TURN_OFF": "Reguła SWZ nie jest spełniona, zastosuj krótszy przewód (max. {{maxLength}}m) albo zwiększ przekrój przewodu (min. {{minDiameter}}mm\u00B2) albo zmień parametry wyłącznika nadprądowego ({{closestOpName}})",
                "WRONG_OVERCURRENT_PROTECTION": "Prąd nominalny wył. nadprądowego musi mieścić się w przedziale [{{lower}}, {{upper}}] [A].",
                "NO_ZEROING_TNC": "Przyłącze typu TN-C wymaga zerowania",
                "NO_ZEROING_OTHER": "Przyłącze typu {{type}} nie toleruje zerowania",
                'RCD_TOTAL_CURRENT': 'Przez RCD może płynąć prąd większy niż nominalny (użyj: {{minNominationCurrent}}[A])',
                'NO_MATCHING_RCD': 'Ustawiony prąd nominalny jest wciąż za mały. Należy rozdzielić RCD na kilka i rozłożyć między nimi wszystkie obciążenia.',
                'DESCENDING_CAPACITY': 'Wytrzymałość prądowa przewodu mniejsza niż elementu/ów podrzędnych. Należy ją ograniczyć u dzieci lub zwiększyć na tym elemencie (przykładowo zastosuj przekrój: {{minDiameter}}mm\u00B2).',
                'RCD_TNC': 'RCD nie moży być użyty w sieci z przyłączem typu TN-C. Może działać nieprawidłowo.',
            },
            "WARN": {
                "START_CURRENT_ISSUE": 'Wysoki prąd rozruchowy może osiagnąć nawet {{maxStartCurrent}}[A]. Wył. nadprądowy zadziała dla wartości {{opFireCurrent}}[A]. Zwiększ klasę wyłącznika lub zmniejsz moc obciążenia (max: {{maxPower}}[W]).',
            },
            "INFO": {
                "TOO_BIG_WIRE_DIAMETER": "Przewód może być mniejszy, (użyj: {{matchingDiameter}}).",
                "OVERCURRENT_SPLIT_POSSIBLE": "Istnieją nie nachodzące na siebie zakresy prądowe {{rangeListString}}, należy rozdzielić obciążenia na kilka wyłączników nadprądowych.",
                "NO_MATCHING_OP": "W typoszeregu wył. nadprądowych nie ma wartości spełniającej wymagany zakres. Należy zwiększyć przekrój przewodu lub zmniejszyć pobór mocy, tym samym zmieniając granice przedziału."
            },
            "QUESTIONS": {
                "SINGLE_ELEMENT_DELETE": 'Na pewno chcesz usunąć wskazany element?',
                "MULTI_ELEMENT_DELETE": 'Ten element posiada {{childrenCount}} podłączonych dalej elementów! Na pewno chcesz usunąć je wszystkie?',
                "DELETE_PROJECT": 'Na pewno chcesz usunąć projekt: {{projectName}}?',
                "UNSAVED_CHANGES": 'Istnieją niezapisane zmiany! Na pewno chcesz się wykonać operację i utracić je?',
                "DELETE_ORPHANS": 'Czy na pewno chcesz usunąć wszystkie elementy przypisane do nie istniejących projektów?',
                'RESET_MIGRATIONS': 'Czy na pewno chcesz zresetować migracje bazodanowe? Wszystkie dane zostaną utracone!',
                "DELETE_MULTI_PROJECT": 'Na pewno chcesz usunąć {{count}} projektów?',
            },
            "COMMON": {
                "LOADING": 'Ładowanie...',
                "YES": 'Tak',
                "NO": 'Nie',
                "DONE": 'Zakończ',
                "SELECT": 'Wybierz',
                "NAME": 'Nazwa',
                "OWNER": 'Właściciel',
                "ELEMENT_COUNT": 'Ilość elementów',
                "EDIT_TYPE_INFO": 'Zmieniasz typ istniejącego elementu. Wspólne parametry dla obu typów zostaną skopiowane, pozostałe zostaną ustawione na domyślne wartości. Aktualne wartości parametrów starego typu zostaną bezpowrotnie utracone!',
                "OP_CURRENT_OUT_OF_SERIES": 'Aktualny prąd nominalny nie jest dostępny w szeregu dla klasy {{class}}',
                "SET_DEFAULT": 'Ust. Domyślne',
                'PROJECT_WIRE_INFO': 'Ustaw parametry przewodu które będą domyślnie wybierane podczas dodawania dowolnego elementu w tym projekcie.',
                'SWITCHBOARD_SETTINGS': 'Nastaw na rozdzielnicę',
                'PREDEFINED_WIRE_INFO': 'Przewód zdefiniowany dla całego projektu różni się od tego przypisanego dla wybranego aktualnie typu elementu. Ten drugi ma wyższy priorytet i zostanie wykorzystany. Odznacz opcję jeśli chcesz użyć przewód projektowy.',
                'PROJECT_WIRE_TITLE': 'Przewód projektowy: ',
                'EDITED_ELEMENT_WIRE_TITLE': 'Przewód elementu: ',
                'PREDEFINED_WIRE_TITLE': 'Przewód pre-definiowany: ',
                "SELECT_LIGHT_POWER_TITLE": 'Dobór mocy oświetlenia',
                'LIGHT_POWER_SELECTOR': 'Dobierz moc oświetlenia w zależności od parametrów pomieszczenia i rodzaju światła.',
                'ROOM_TYPE': 'Rodzaj pomieszczenia',
                'ROOMS': {
                    'RESIDENTIAL': 'Mieszkalne',
                    'CORRIDOR_OR_UTILITY': 'Korytarz lub gospodarcze',
                },
                'LIGHT_KIND': 'Rodzaj światła',
                'LIGHT_KINDS': {
                    'CLASSIC_BULB': 'Klasyczna żarówka',
                    'LINEAR_FLUORESCENT_LAMP': 'Liniowa lampa fluoroscencyjna',
                    'INDUCTION_LAMP': 'Lampa indukcyjna',
                    'COMPACT_FLUORESCENT_LAMP': 'Kompaktowa lampa fluoroscencyjna',
                    'LED': 'Lampa LED-owa',
                },
                'LIGHT_EFFICIENCY': 'Wydajność świetlna [lm/W]',
                'ROOM_AREA': 'Pole pomieszczenia [m\u00B2]',
                'REQUIRED_LOAD_POWER': 'Wymagana moc [W]',
                "EDIT": "Edytuj",
                "GO_TO_PLANNER": "Przejdź do planera",
                "DELETE": "Usuń",
                "CANCEL": "Anuluj",
                "LIGHT_EFFICIENCY_TOOLTIP": "Wydajność świetlna źródła światła. Każdy rodzaj źródła światła ma możliwy zakres tej wydajności, ale Twoje konkretne źródła mogą mieć jakąś niestandardową wartość z tego zakresu, więc ustaw ją tutaj. Jeśli nie masz konkretnej wartości, po prostu naciśnij przycisk Średnia, aby ustawić średnią wartość z poprawnego zakresu.",
                "SET_AVG": "Średnia",
            },
            "VALIDATION": {
                'OUT_OF_RANGE': 'Przekroczono przedział [{{min}}, {{max}}]',
                'GREATER_THAN': 'Wartość musi być nie mniejsza niż {{value}}',
            },
            "PROJECTS_COL": {
                "PROJECT_NAME": "Nazwa projektu",
                "ELEMENT_COUNT": "Ilość elementów",
                "OWNER": "Właściciel",
                "MODIFIED_BY": "Zmodyfikowany przez",
                "LAST_MODIFIED_AT": "Ostatnia modyfikacja",
                "ACTIONS": "Akcje"
            },
        }
    }
};

export const LANGUAGE_VALUES = Object.keys(resources);

i18n
    .use(initReactI18next)
    .init({
        compatibilityJSON: 'v3',
        resources,
        lng: "en",
        interpolation: {
            escapeValue: false // react already safes from xss
        },
    })
    .then(() => console.log('i18n init success'))
    .catch(e => console.error(e));

export default i18n;