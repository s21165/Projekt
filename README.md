By uruchomić kod należy zainstalować niezbędne biblioteki z pliku requierments.txt.

Ze względów bezpieczeństwa należy użyć swojego własnego klucza openai api key w zmiennej środowiskowej. 

Instrukcja:
    
    Otwórz Właściwości systemu i wybierz Zaawansowane ustawienia systemu.

    Wybierz Zmienne środowiskowe...

    Wybierz Nowy... z sekcji Zmienne użytkownika (u góry). Dodaj parę nazwa/klucz wartości, zamieniając <yourkey> na swój klucz API.

Nazwa zmiennej: OPENAI_API_KEY
Wartość zmiennej: <yourkey> 

W przypadku pracy ze środowiskiem wirtualnym, po jego uruchomieniu w CMD:

    Windows : setx OPENAI_API_KEY "TwójKluczAPI"
    Linux lub macOS : export OPENAI_API_KEY="TwójKluczAPI"
    Możesz również ustawić zmienną środowiskową w pliku konfiguracyjnym środowiska wirtualnego, jeśli używasz narzędzi takich jak virtualenv.

Po ustawieniu zmiennej środowiskowej, upewnij się, że ponownie uruchomiłeś swoje środowisko wirtualne lub ponownie uruchomiłeś swoją aplikację lub skrypt, aby zastosować zmiany.
