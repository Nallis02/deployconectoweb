<template>
  <div id="app">
    <nav>
      <div>
        <img
          src="https://static.wixstatic.com/media/ebecf3_69cf9fcc1fbf471cb39a86b6e6d3badc~mv2.png/v1/fill/w_590,h_171,al_c,lg_1,q_85,enc_avif,quality_auto/logo-conecto-web-agency-agencia-marketing-digital-png-transparente.png"
          alt="Logo"
          class="logo"
        />
      </div>
      <div class="menu">
        <router-link to="/">Home</router-link> |
        <router-link to="/pedidos">Pedidos</router-link>
      </div>
    </nav>
    <!-- router-view maneja los componentes para que los muestre -->
    <router-view></router-view>
    <footer>
      Hecho con amor
    </footer>
  </div>
</template>



