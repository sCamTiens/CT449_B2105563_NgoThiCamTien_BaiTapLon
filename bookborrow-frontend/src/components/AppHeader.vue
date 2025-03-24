<template>
    <nav class="navbar navbar-expand navbar-dark bg-dark">
        <a href="/" class="navbar-brand">Ứng dụng Quản lý Mượn Sách</a>
        <div class="navbar-nav mr-auto">
            <li class="nav-item">
                <router-link :to="{ name: 'booklist' }" class="nav-link">
                    Sách <i class="fas fa-book"></i>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link :to="{ name: 'muonsachlist' }" class="nav-link">
                    Mượn sách <i class="fas fa-book-reader"></i>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link :to="{ name: 'docgialist' }" class="nav-link">
                    Độc giả <i class="fas fa-users"></i>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link :to="{ name: 'nhaxuatbanlist' }" class="nav-link">
                    Nhà xuất bản <i class="fas fa-building"></i>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link :to="{ name: 'nhanvienlist' }" class="nav-link">
                    Nhân viên <i class="fas fa-user-tie"></i>
                </router-link>
            </li>
        </div>
    </nav>
</template>
